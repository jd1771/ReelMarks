import express from "express";
import * as dotenv from "dotenv";
import { getVideoInfo, getVideoLength } from "./common/getYoutubeData.js";
import { getYoutubeTranscript } from "./common/getYoutubeTranscript.js";
import { cleanTranscript } from "./common/cleanTranscript.js";

dotenv.config();

const app = express();

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

    const cleanedTranscript = cleanTranscript(transcriptResponse, 50);

    const data = {
        title: videoInfo.title,
        duration: videoInfo.duration,
        transcript: cleanedTranscript,
    };

    res.send(cleanedTranscript);
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
