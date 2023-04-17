import express from "express";
import * as dotenv from "dotenv";
import { getVideoInfo, getVideoLength } from "./common/getYoutubeData.js";
import { getYoutubeTranscript } from "./common/getYoutubeTranscript.js";
import { cleanTranscript } from "./common/cleanTranscript.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const app = express();

const openAIConfiguration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openAIConfiguration);

app.get("/api/:vidID", async (req, res) => {
    const videoId = req.params.vidID;

    const videoInfo = await getVideoInfo(videoId, process.env.YOUTUBE_API_KEY);
    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const transcriptResponse = await getYoutubeTranscript(videoId);

    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const prompt =
        "Subdivide following transcription data into a maximum of 3 sections in the format (0:00 - description). For each section give the timestamp and a short 1-2 sentence description of what happens in that section.";
    const cleanedTranscript = cleanTranscript(transcriptResponse, 100);
    const timestamps = [];
    // For each batch make a call to the OpenAI API to generate the timestamps
    for (let i = 0; i < 1; i++) {
        const batch = cleanedTranscript[i];
        console.log(prompt + JSON.stringify(batch));
        //const response = await openai.createCompletion({
        //    model: "text-davinci-003",
        //    prompt: prompt + JSON.stringify(batch),
        //    temperature: 0.2,
        //    max_tokens: 2000,
        //
        //    //n: 1,
        //    stream: false,
        //});
        ////console.log(prompt + JSON.stringify(batch));
        //const timestampsBatch = response.data.choices[0].text;
        //timestamps.push(timestampsBatch);
        // timestamps.push(timestampsBatch);
        // timestampsBatch.forEach((timestamp, index) => {
        //     timestamps.push({
        //         text: batch[index].text,
        //         time: timestamp,
        //     });
        // });
    }

    const data = {
        title: videoInfo.title,
        duration: videoInfo.duration,
        transcript: cleanedTranscript,
    };

    res.send(timestamps);
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
