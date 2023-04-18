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

    const prompt = `Summarize this section from the video '${videoInfo.title}'. The summary should be no more than 30 words`;
    const cleanedTranscript = cleanTranscript(transcriptResponse, 100);
    const timestamps = [];
    // For each batch make a call to the OpenAI API to generate the timestamps
    for (let i = 0; i < 1; i++) {
        // Get the batch of transcript items
        const batch = cleanedTranscript[i];

        // Send the batch to the OpenAI API and retrieve the summarized text
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt + JSON.stringify(batch),
            temperature: 0.2,
            max_tokens: 2000,
            stream: false,
        });
        //console.log(prompt + JSON.stringify(batch));
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
