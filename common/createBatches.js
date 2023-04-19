/**
 * Splits the transcript data into batches of roughly equal size.
 * @param {Array} transcript - An array of objects representing the transcript data, with each object containing a "time" and "text" property.
 * @returns {Array} An array of transcript batches, with each batch containing roughly the same number of transcript objects. If the size of each batch exceeds 3000 bytes, the maximum size of each batch will be 3000 bytes.
 */
export function createBatches(transcript, MAX_BATCHES = 6) {
    const transcriptBytes = transcript.reduce((acc, curr) => {
        const currBytes = new TextEncoder().encode(JSON.stringify(curr)).length;
        return acc + currBytes;
    }, 0);
    const bytesPerBatch = Math.ceil(transcriptBytes / MAX_BATCHES);
    const maxBytesPerBatch = Math.min(bytesPerBatch, 3000);

    const transcriptChunks = [];

    for (let i = 0; i < transcript.length; i++) {
        const currChunk = transcript[i];
        const currBytes = new TextEncoder().encode(
            JSON.stringify(currChunk)
        ).length;
        let startIndex = 0;
        let endIndex = maxBytesPerBatch;

        while (startIndex < currBytes) {
            const chunk = JSON.stringify(currChunk).slice(startIndex, endIndex);
            transcriptChunks.push(JSON.parse(chunk));
            startIndex = endIndex;
            endIndex = Math.min(endIndex + maxBytesPerBatch, currBytes);
        }
    }

    const batches = [];

    for (let i = 0; i < MAX_BATCHES; i++) {
        const startIdx = (i * transcriptChunks.length) / MAX_BATCHES;
        const endIdx = ((i + 1) * transcriptChunks.length) / MAX_BATCHES;
        const batch = transcriptChunks.slice(startIdx, endIdx);
        batches.push(batch);
    }

    return batches;
}
