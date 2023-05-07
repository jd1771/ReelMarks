# ReelMarks

ReelMarks is an application that generates timestamps for YouTube videos using OpenAI's GPT-3 API. It provides a simple API endpoint to retrieve the generated timestamps for a given YouTube video ID.

## API Endpoint

The only API endpoint is GET `/api/:id` where `id` is the YouTube video ID.

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
