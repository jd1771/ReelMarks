import express from "express";
import bodyParser from "body-parser";
import redis from "redis";
import { promisify } from "util";
import * as dotenv from "dotenv";

// Load in the environment variables
dotenv.config({ path: "../.env" });

// Create a Redis client
const client = redis.createClient();

// Promisify Redis client methods
const redisGetAsync = promisify(client.get).bind(client);
const redisSetAsync = promisify(client.set).bind(client);

// Initialize Express app
const app = express();

// Use JSON body parser middleware
app.use(bodyParser.json());

// Define a route to store transcription results
app.post("/transcript", (req, res) => {
    // Get the transcript data from the request body
    const { videoId, transcript } = req.body;

    // Store the transcript data in Redis
    redisSetAsync(videoId, JSON.stringify(transcript))
        .then(() => {
            // Return a success response
            res.send("Transcript stored successfully");
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send("Error storing transcript");
        });
});

// Define a route to retrieve transcription results
app.get("/transcript/:videoId", (req, res) => {
    // Get the video ID from the request parameters
    const { videoId } = req.params;

    // Retrieve the transcript data from Redis
    redisGetAsync(videoId)
        .then((result) => {
            // Check if transcript data was found for the video ID
            if (result) {
                const transcript = JSON.parse(result);
                return res.send(transcript);
            }

            // Return a not found response if transcript data was not found
            res.status(404).send("Transcript not found");
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).send("Error retrieving transcript");
        });
});

// Start the server
const port = process.env.REDIS_SERVER_PORT || 3001;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
