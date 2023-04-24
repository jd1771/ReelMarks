/**
 * Splits the transcript data into batches of roughly equal size.
 * @param {Array} transcript - An array of objects representing the transcript data, with each object containing a "time" and "text" property.
 * @returns {Array} An array of transcript batches, with each batch containing roughly the same number of transcript objects. If the size of each batch exceeds 3000 bytes, the maximum size of each batch will be 3000 bytes.
 */
export function createBatches(transcript, MAX_BATCHES = 6) {
    const NUM_TOKENS_ALLOWED = 3500;
    const CHARACTERS_PER_TOKEN = 4;
    const transcriptBytes = transcript.reduce((acc, curr) => {
        const currBytes = new TextEncoder().encode(JSON.stringify(curr)).length;
        return acc + currBytes;
    }, 0);

    // 4 bytes == 4 chars == 1 token
    const bytesPerBatch = Math.ceil(transcriptBytes / MAX_BATCHES);

    const maxBytesPerBatch = Math.min(
        bytesPerBatch,
        NUM_TOKENS_ALLOWED * CHARACTERS_PER_TOKEN
    );

    //console.log("total bytes", transcriptBytes);
    //console.log("bytes per batch", bytesPerBatch);
    //console.log("max bytes per batch", maxBytesPerBatch);

    // Split the data such that each batch is a maximum size of maxBytesPerBatch
    const transcriptChunks = [];
    let currBytes = 0;
    let currChunks = [];
    for (let i = 0; i < transcript.length; i++) {
        const currChunk = transcript[i];
        const currChunkBytes = new TextEncoder().encode(
            JSON.stringify(currChunk)
        ).length;

        if (currBytes + currChunkBytes > maxBytesPerBatch) {
            transcriptChunks.push(currChunks);
            currBytes = currChunkBytes;
            currChunks = [currChunk];
        } else {
            currChunks.push(currChunk);
            currBytes += currChunkBytes;
        }

        if (i === transcript.length - 1) {
            transcriptChunks.push(currChunks);
        }
    }

    return transcriptChunks;
}
