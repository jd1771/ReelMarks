/*
 *   This function gets the transcript of a video from YouTube
 *   @param {String} videoId - The video ID
 *   @returns {Array} - The video transcript
 */

export async function getVideoTranscript(videoId) {
    const captionParams = {
        part: "snippet",
        videoId: videoId,
        fields: "items(snippet(trackKind,language),id)",
    };

    try {
        const captionResponse = await youtube.captions.list(captionParams);

        if (
            !captionResponse.data.items ||
            captionResponse.data.items.length === 0
        ) {
            return { error: "Captions not available for this video" };
        }

        const captionTrackId = captionResponse.data.items[0].id;

        const transcriptParams = {
            id: captionTrackId,
        };

        const transcriptResponse = await youtube.captions.download(
            transcriptParams
        );

        const captions = transcriptResponse.data.replace(/\n/g, " ").split(" ");

        return captions;
    } catch (error) {
        console.error(error);
        return { error: "Error retrieving video transcript" };
    }
}
