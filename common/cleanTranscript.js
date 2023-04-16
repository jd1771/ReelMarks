/*
 * This function is used to clean the transcript of the audio file.
 * It removes all the punctuation and special characters and converts the offset to seconds.
 * @param {String} transcript - The transcript of the audio file
 * @returns {String} - The cleaned transcript
 */
export function cleanTranscript(transcript, batchSize = 50) {
    // Remove all the punctuation and special characters
    const cleanedTranscript = transcript.map((t) => ({
        time: t.offset / 1000,
        text: t.text.replace(/[\r\n]/g, " ").replace(/[^a-zA-Z0-9 ]/g, ""),
    }));

    // Split the cleaned transcript into batches
    const batches = [];
    for (let i = 0; i < cleanedTranscript.length; i += batchSize) {
        const batch = cleanedTranscript.slice(i, i + batchSize);
        batches.push(batch);
    }

    return batches;
}
