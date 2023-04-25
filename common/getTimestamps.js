import { Configuration, OpenAIApi } from "openai";

export async function getTimestamps(batches, prompt, API_KEY) {
    const openAIConfiguration = new Configuration({
        apiKey: API_KEY,
    });

    const openai = new OpenAIApi(openAIConfiguration);

    const timestamps = [];

    // For each batch make a call to the OpenAI API to generate the timestamps
    for (let i = 0; i < batches.length; i++) {
        // Get the batch of transcript items
        const batch = batches[i];

        // Send the batch to the OpenAI API and retrieve the summarized text
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt + batch.text,
            temperature: 0.2,
            max_tokens: 150,
            stream: false,
        });

        let timestampText = response.data.choices[0].text;

        // Remove any new lines from the text
        timestampText = timestampText.replace(/(\r\n|\n|\r)/gm, "");

        // Get the time from the batch
        const time = batch;

        // Get the time/text object
        const timeText = {
            time: time,
            text: timestampText,
        };

        // Add the time/text object to the timestamps array
        timestamps.push(timeText);
    }

    return timestamps;
}
