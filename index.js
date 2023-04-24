import express from "express";
import * as dotenv from "dotenv";
import { getVideoInfo, getVideoLength } from "./common/getYoutubeData.js";
import { getYoutubeTranscript } from "./common/getYoutubeTranscript.js";
import { createBatches } from "./common/createBatches.js";
import { Configuration, OpenAIApi } from "openai";
import redis from "redis";

dotenv.config();

const app = express();

const openAIConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfiguration);

const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
});

(async () => {
    try {
        await redisClient.connect();
        console.log("Redis client connected");
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1);
    }
})();

app.get("/api/:vidID", async (req, res) => {
    const videoId = req.params.vidID;

    // Check if the videoID exists in Redis
    //try {
    //    const result = await redisClient.get(videoId);
    //    if (result) {
    //        console.log("Retrieved from Redis");
    //        return res.send(JSON.parse(result));
    //    }
    //} catch (error) {
    //    return res.send("Error retrieving video");
    //}

    const videoInfo = await getVideoInfo(videoId, process.env.YOUTUBE_API_KEY);
    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const transcriptResponse = await getYoutubeTranscript(videoId);

    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const prompt = `Summarize this section from the video '${videoInfo.title}'. The summary should be no more than 30 words. Don't include spoilers to the video content`;
    const cleanedTranscript = transcriptResponse.map((t) => ({
        time: t.offset / 1000,
        text: t.text.replace(/[\r\n]/g, " ").replace(/[^a-zA-Z0-9 ]/g, ""),
    }));

    const batches = createBatches(cleanedTranscript);
    const timestamps = [];

    // For each batch make a call to the OpenAI API to generate the timestamps
    for (let i = 0; i < batches.length; i++) {
        // Get the batch of transcript items
        const batch = batches[i];
        console.log("starting batch " + i + " of " + batches.length + "");

        // print the size of the batch in bytes
        //console.log(Buffer.byteLength(JSON.stringify(batch)));

        // Send the batch to the OpenAI API and retrieve the summarized text
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt + JSON.stringify(batch),
            temperature: 0.2,
            max_tokens: 2000,
            stream: false,
        });

        let timestampText = response.data.choices[0].text;

        // Remove any new lines from the text
        timestampText = timestampText.replace(/(\r\n|\n|\r)/gm, "");

        // Get the time from the first item in the batch and convert it to minutes
        const time = batch[0]["time"];

        // Get the time/text object
        const timeText = {
            time: time,
            text: timestampText,
        };

        // Add the time/text object to the timestamps array
        timestamps.push(timeText);

        console.log("completed batch " + i);
    }

    // Create data object
    const data = {
        title: videoInfo.title,
        duration: videoInfo.duration,
        transcript: cleanedTranscript,
        timestamps: timestamps,
    };

    // Save the transcription in Redis
    await redisClient.set(videoId, JSON.stringify(timestamps));

    res.send(data.timestamps);
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
