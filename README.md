# AI-Imagery

# ReelMarks

ReelMarks is an application that generates timestamps for YouTube videos using OpenAI's GPT-3 API. It provides a simple API endpoint to retrieve the generated timestamps for a given YouTube video ID.

## API Endpoint

The only API endpoint is GET `/api/:id` where `id` is the YouTube video ID.

## Example API Call

Here is the result of an API call to the target url `http://localhost:3000/api/vw-KWfKwvTQ`

This call returns the following object. Here the duration represents the length of the video in seconds:

```json
{
    "title": "GPT-4 - How does it work, and how do I build apps with it? - CS50 Tech Talk",

    "duration": 4075,

    "timestamps": [
        {
            "time": "0:00:00",

            "text": "GPT-4 is a large language model that can generate new text, predict words, and be used for copywriting, chatbots, and AI apps. McGill University and Steamship are making it easier to build and deploy apps with these technologies. GPT-3 can replicate the internet and understand different genres of text."
        },

        {
            "time": "0:22:08",

            "text": "GPT-4 is a language model that can answer questions and solve problems in a Q&A form. It can access Wolfram, search the web, and do tasks like Instacart. It can be used to build companionship bots, question answering, utility functions, and creative experiments."
        },

        {
            "time": "0:30:48",

            "text": "GPT-4 can be used to build apps with conversational intelligence, from CS101 grads to professionals. Examples include companionship bots, question answering, and utility functions."
        },

        {
            "time": "0:39:43",

            "text": "GPT-4 allows for language understanding, enabling tasks such as generating unit tests, looking up documentation, rewriting functions, and more. Domain knowledge is key to using GPT-4 to create apps, such as a writing Atlas project."
        },

        {
            "time": "0:48:55",

            "text": "GPT-4 can be used to build apps with tools such as a generated to-do list and web search. It can be kickstarted with a prompt and harnessed to iterate, and is accessible to everyone. Hallucination is a problem, but can be mitigated with examples and prepending \"my best guess\"."
        },

        {
            "time": "0:57:50",

            "text": "GPT-4 can simulate personalities and predict how a conscious being would react in a particular situation. It is sensitive to prompts and can create business value in AI apps. It is not conscious and cannot think like people, but can pass some tests."
        }
    ]
}
```

## Environment Variables

The following environment variables are required:

-   `REDIS_SERVER_PORT`: The port on which Redis server is running.

-   `REDIS_URL`: The URL of the Redis server.

-   `REDIS_EXPIRATION_TIME`: The expiration time for the Redis cache (in seconds). A value of `0` means that the cached value will never expire.

-   `YOUTUBE_API_KEY`: The API key for the YouTube API.

-   `OPENAI_API_KEY`: The API key for the OpenAI GPT-3 API.

## Getting Started

To run the application locally, you will need to have Docker and Docker Compose installed. Follow these steps:

1. Clone the repository.

2. Create a `.env` file in the root of the project and add the required environment variables.

3. Build the Docker image using `docker-compose build`.

4. Start the Docker container using `docker-compose up`.

5. The application should now be running at `http://localhost:3000`.

6. To stop the Docker container, run `docker-compose down`.

## Technologies Used

-   Node.js

-   Express.js

-   Redis

-   Docker

-   OpenAI GPT-3 API

-   YouTube API
