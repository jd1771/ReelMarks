const { getVideoInfo, getVideoLength } = require("./common/getYoutubeData.js");
const { getYoutubeTranscript } = require("./common/getYoutubeTranscript.js");
const { createBatches } = require("./common/createBatches.js");
const { getTimestamps } = require("./common/getTimestamps.js");
const redis = require("redis");

const redisClient = redis.createClient({
    host: "localhost",
    port: 6379,
});

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
        console.log("Redis client connected");
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1);
    }
})();

exports.handler = async function (event, context) {
    const videoId = event.queryStringParameters.vidID;

    // Check if the videoID exists in Redis
    try {
        const result = await redisClient.get(videoId);
        if (result) {
            console.log("Retrieved from Redis");
            return {
                statusCode: 200,
                body: result,
            };
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: "Error retrieving video",
        };
    }

    const videoInfo = await getVideoInfo(videoId);
    if (videoInfo.error) {
        return {
            statusCode: 404,
            body: videoInfo,
        };
    }

    const lengthInSeconds = getVideoLength(videoInfo);

    // Bail if the video length is longer than 3 hours
    if (lengthInSeconds > 10800) {
        return {
            statusCode: 400,
            body: { error: "Video exceeds max duration of 3 hours" },
        };
    }

    const transcriptResponse = await getYoutubeTranscript(videoId);

    if (transcriptResponse.error) {
        return {
            statusCode: 404,
            body: transcriptResponse,
        };
    }

    const prompt = `Summarize the following section from the video '${videoInfo.title}'. The summary should be a maximum of 20 words. Don't include spoilers for the video content. Summarize: `;
    const cleanedTranscript = transcriptResponse.map((t) => ({
        time: t.offset / 1000,
        text: t.text.replace(/[\r\n]/g, " ").replace(/[^a-zA-Z0-9 ]/g, ""),
    }));

    const batches = createBatches(cleanedTranscript);
    const timestamps = await getTimestamps(batches, prompt);

    // Create data object
    const data = {
        title: videoInfo.title,
        duration: lengthInSeconds,
        timestamps: timestamps,
    };

    // Save the transcription in Redis
    await redisClient.set(videoId, JSON.stringify(data));

    return {
        statusCode: 200,
        body: data,
    };
};
