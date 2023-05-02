/**
 * Splits the transcript data into batches of roughly equal size.
 * @param {Array} transcript - An array of objects representing the transcript data, with each object containing a "time" and "text" property.
 * @returns {Array} An array of transcript batches, with each batch containing roughly the same number of transcript objects. If the size of each batch exceeds 3000 bytes, the maximum size of each batch will be 3000 bytes.
 */
function createBatches(transcript, MAX_BATCHES = 6) {
    const NUM_TOKENS_ALLOWED = 3200;
    const CHARACTERS_PER_TOKEN = 4;
    const transcriptBytes = transcript.reduce((acc, curr) => {
        const currBytes = new TextEncoder().encode(curr.text).length;
        return acc + currBytes;
    }, 0);

    // 4 bytes == 4 chars == 1 token
    const bytesPerBatch = Math.ceil(transcriptBytes / MAX_BATCHES);

    const maxBytesPerBatch = Math.min(
        bytesPerBatch,
        NUM_TOKENS_ALLOWED * CHARACTERS_PER_TOKEN
    );

    // Split the data such that each batch is a maximum size of maxBytesPerBatch
    const transcriptChunks = [];
    let currBytes = new TextEncoder().encode(transcript[0].text).length;
    let currChunks = {
        time: 0,
        text: transcript[0].text,
    };
    for (let i = 1; i < transcript.length; i++) {
        const currChunk = transcript[i];
        const currChunkBytes = new TextEncoder().encode(currChunk.text).length;

        if (currBytes + currChunkBytes > maxBytesPerBatch) {
            transcriptChunks.push(currChunks);
            currBytes = currChunkBytes;
            currChunks = {
                time: currChunk.time,
                text: currChunk.text,
            };
        } else {
            currChunks.text += " " + currChunk.text;
            currBytes += currChunkBytes;
        }

        // Handle the last chunk
        if (i === transcript.length - 1) {
            // If the last chunk is less than 350 bytes, add it to the previous chunk
            if (currChunkBytes < 350) {
                transcriptChunks[transcriptChunks.length - 1].text +=
                    " " + currChunk.text;
                // Otherwise, add it as a new chunk
            } else {
                transcriptChunks.push(currChunks);
            }
        }
    }

    return transcriptChunks;
}

module.exports = {
    createBatches,
};
