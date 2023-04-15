import { YoutubeTranscript } from "youtube-transcript";
/*
 *   This function gets the transcript of a video from YouTube
 *   @param {String} videoId - The video ID
 *   @returns {Obj} - The video transcript log
 */
export async function getYoutubeTranscript(videoId) {
    try {
        // Return the Korean caption
        const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: "en",
        });

        return transcript;
    } catch (error) {
        console.error(error);
        return { error: "Error retrieving video transcript" };
    }
}
