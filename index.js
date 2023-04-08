import express from "express";
import * as dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const app = express();

// Create YouTube client with the API key
const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

app.get("/api/:vidID", async (req, res) => {
    const id = req.params.vidID;

    const videoParams = {
        part: "snippet,contentDetails",
        id: id,
    };

    try {
        // Call the videos.list API endpoint with the specified parameters
        const response = await youtube.videos.list(videoParams);

        // send response data to client with status code
        res.status(200).send(response.data);
    } catch (error) {
        // send error message to client with status code
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
