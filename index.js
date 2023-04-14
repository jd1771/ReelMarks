import express from "express";
import * as dotenv from "dotenv";
import { google } from "googleapis";
import { getVideoInfo, getVideoLength } from "./common/getYoutubeData.js";
import { getVideoTranscript } from "./common/getTranscript.js";

dotenv.config();

const app = express();

app.get("/api/:vidID", async (req, res) => {
    const videoId = req.params.vidID;

    const videoInfo = await getVideoInfo(videoId);
    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const transcript = await getVideoTranscript(videoId);
    if (transcript.error) {
        return res.status(404).send(transcript);
    }

    const data = { videoInfo, transcript };
    res.send(data);
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
