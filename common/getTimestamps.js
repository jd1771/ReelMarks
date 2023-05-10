import { Configuration, OpenAIApi } from "openai";

/**
 * Get's the transcript data for each batch that was created.
 * @param {Array} batches - An array of transcript batches, with each batch containing roughly the same number of transcript objects. If the size of each batch exceeds 3000 bytes, the maximum size of each batch will be 3000 bytes.
 * @param {string} prompt - The prompt to use for the OpenAI API.
 * @param {string} API_KEY - The API key to use for the OpenAI API.
 * @returns {Array} An array of time/text objects, with each object containing a "time" and "text" property.
 */
export async function getTimestamps(batches, prompt) {
    const openAIConfiguration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(openAIConfiguration);

    const timestamps = [];

    // For each batch make a call to the OpenAI API to generate the timestamps
    for (let i = 0; i < batches.length; i++) {
        // Get the batch of transcript items
        const batch = batches[i];
        const fullPrompt = prompt + "'" + batch.text + "'";

        // Send the batch to the OpenAI API and retrieve the summarized text
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: fullPrompt,
            temperature: 0.2,
            max_tokens: 150,
            stream: false,
        });

        let timestampText = response.data.choices[0].text;

        // Remove any new lines from the text
        timestampText = timestampText.replace(/(\r\n|\n|\r)/gm, "");

        // Get the time from the batch
        let time = batch.time;

        // Convert the time to a youtube timestamp string
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time - hours * 3600) / 60);
        const seconds = Math.floor(time - hours * 3600 - minutes * 60);

        const timeString = `${hours}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // Get the time/text object
        const timeText = {
            time: timeString,
            text: timestampText,
        };

        // Add the time/text object to the timestamps array
        timestamps.push(timeText);
    }

    return timestamps;
}
