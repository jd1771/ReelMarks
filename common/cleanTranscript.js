/*
 * This function is used to clean the transcript of the audio file.
 * It removes all the punctuation and special characters.
 * @param {String} transcript - The transcript of the audio file
 * @returns {String} - The cleaned transcript
 */
export function cleanTranscript(transcript) {
    // Remove all the punctuation and special characters
    let res = [];
    for (let i = 0; i < transcript.length; i++) {
        const text = transcript[i].text
            .replace(/(\r\n|\n|\r)/gm, "")
            .trim()
            .replace(/[^a-zA-Z0-9 ]/g, "");
        const offset = transcript[i].offset / 1000;
        res.push({
            time: offset,
            text: text,
        });
    }
    return res;
}
