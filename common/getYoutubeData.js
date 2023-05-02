const { google } = require("googleapis");
const moment = require("moment");

/**
 * This function retrieves information about a YouTube video
 * @param {string} videoId - The ID of the YouTube video
 * @param {Object} youtube - The YouTube API object
 * @returns {Object} - An object containing information about the video
 */
async function getVideoInfo(videoId, API_KEY) {
    // Create a new YouTube object
    const youtube = google.youtube({
        version: "v3",
        auth: API_KEY,
    });

    // Create the parameters for the YouTube API call
    const videoParams = {
        part: "snippet,contentDetails",
        id: videoId,
    };

    // Make the API call
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
 *   This function gets the length of the video
 *   @param {Object} videoInfo - The video info object
 *  @returns {Number} - The video length in seconds
 */
function getVideoLength(videoInfo) {
    console.log(videoInfo);
    const durationEncoded = videoInfo.duration;
    const videoLength = moment.duration(durationEncoded).asSeconds();

    return videoLength;
}

module.exports = {
    getVideoInfo,
    getVideoLength,
};
