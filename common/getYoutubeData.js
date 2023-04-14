import { google } from "googleapis";
import * as dotenv from "dotenv";

dotenv.config();

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

/**
 * This function retrieves information about a YouTube video
 * @param {string} videoId - The ID of the YouTube video
 * @returns {Object} - An object containing information about the video
 */
export async function getVideoInfo(videoId) {
    const videoParams = {
        part: "snippet,contentDetails",
        id: videoId,
    };

    try {
        const videoResponse = await youtube.videos.list(videoParams);

        if (videoResponse.data.items.length === 0) {
            return { error: "Video not found" };
        }

        const videoInfo = {
            title: videoResponse.data.items[0].snippet.title,
            description: videoResponse.data.items[0].snippet.description,
            duration: videoResponse.data.items[0].contentDetails.duration,
        };

        return videoInfo;
    } catch (error) {
        console.error(error);
        return { error: "Error retrieving video info" };
    }
}

/*
 *   This function gets the length of a video in
 *   @param {Object} videoInfo - The video info object
 *  @returns {Number} - The video length in seconds
 */
export function getVideoLength(videoInfo) {
    const duration = videoInfo.contentDetails.duration;
    const videoLength = moment.duration(duration).asSeconds();

    return videoLength;
}
