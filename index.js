import express from "express";
import * as dotenv from "dotenv";
import { google } from "googleapis";
import { getVideoInfo, getVideoLength } from "./common/getYoutubeData.js";
import { getVideoTranscript } from "./common/getTranscript.js";

dotenv.config();

const app = express();

app.get("/api/:vidID", async (req, res) => {
    try {
        const videoId = req.params.vidID;
        const videoInfo = await getVideoInfo(videoId);
        const videoLength = getVideoLength(videoInfo);
        const transcript = await getVideoTranscript(videoId);

        const response = {
            title: videoInfo.title,
            description: videoInfo.description,
            transcript: transcript,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
