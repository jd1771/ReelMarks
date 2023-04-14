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

    const captionResponse = await youtube.captions.list(captionParams);

    if (
        !captionResponse.data.items ||
        captionResponse.data.items.length === 0
    ) {
        throw new Error("Captions not available for this video");
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
}
