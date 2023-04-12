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
    const videoID = req.params.vidID;

    try {
        const videoInfoParams = {
            part: "snippet,contentDetails",
            id: videoID,
        };

        const videoInfoResponse = await youtube.videos.list(videoInfoParams);
        const videoInfo = videoInfoResponse.data.items[0];
        // Get the captions track ID (if available)
        const captionsFound = videoInfo?.contentDetails?.caption;
        // Get the captions track ID (if available)
        const captionTrackID = videoInfo?.contentDetails?.caption?.itemId;

        if (captionTrackID) {
            const captionsParams = {
                part: "id,snippet",
                videoId: videoID,
                captionId: captionTrackID,
            };

            const captionsResponse = await youtube.captions.list(
                captionsParams
            );
            const captionData = captionsResponse.data.items[0].snippet;

            // Send response data to client with status code and captions
            res.status(200).json({
                videoInfo,
                captionData,
            });
        } else {
            // No captions available
            res.status(200).json({
                videoInfo,
                message: "Captions not available for this video",
            });
        }
    } catch (error) {
        // send error message to client with status code
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => {
    console.debug("App listening on :3000");
});
