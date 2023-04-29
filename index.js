import express from "express";
import * as dotenv from "dotenv";
import { getVideoInfo, getVideoLength } from "./common/getYoutubeData.js";
import { getYoutubeTranscript } from "./common/getYoutubeTranscript.js";
import { createBatches } from "./common/createBatches.js";
import { getTimestamps } from "./common/getTimestamps.js";
import redis from "redis";

dotenv.config();

const app = express();

const redisClient = redis.createClient({
    url: "redis://redis:6379",
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
    try {
        const result = await redisClient.get(videoId);
        if (result) {
            console.log("Retrieved from Redis");
            return res.send(JSON.parse(result));
        }
    } catch (error) {
        return res.send("Error retrieving video");
    }

    const videoInfo = await getVideoInfo(videoId, process.env.YOUTUBE_API_KEY);
    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const transcriptResponse = await getYoutubeTranscript(videoId);

    if (videoInfo.error) {
        return res.status(404).send(videoInfo);
    }

    const prompt = `Summarize the following section from the video '${videoInfo.title}'. The summary should be a maximum of 20 words. Don't include spoilers for the video content. Summarize: `;
    const cleanedTranscript = transcriptResponse.map((t) => ({
        time: t.offset / 1000,
        text: t.text.replace(/[\r\n]/g, " ").replace(/[^a-zA-Z0-9 ]/g, ""),
    }));

    const batches = createBatches(cleanedTranscript);
    const timestamps = await getTimestamps(
        batches,
        prompt,
        process.env.OPENAI_API_KEY
    );

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
