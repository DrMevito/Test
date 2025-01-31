const express = require("express");
const cors = require("cors");
const ytSearch = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const { PassThrough } = require("stream");

const app = express();
app.use(cors());

// Search Route
app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).send("Query is required");

        console.log("Searching for:", query);

        const result = await ytSearch(query);
        const songs = result.videos.filter(video =>
            video.title.toLowerCase().includes("official audio") || 
            video.title.toLowerCase().includes("lyrics") || 
            video.title.toLowerCase().includes("song")
        );

        res.json(songs);
    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).send("Error fetching search results");
    }
});

// Stream Route
app.get("/stream", async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).send("URL is required");

        console.log("Streaming:", videoUrl);

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Transfer-Encoding", "chunked");

        const stream = ytdl(videoUrl, {
            filter: "audioonly",
            quality: "lowestaudio",
            highWaterMark: 1024 * 256, // Reduce buffering
        });

        const passThrough = new PassThrough();
        stream.pipe(passThrough);
        passThrough.pipe(res, { end: true });

        res.on("close", () => {
            console.log("Client disconnected, stopping stream...");
            passThrough.destroy();
        });

    } catch (error) {
        console.error("Streaming Error:", error.message);
        if (!res.headersSent) res.status(500).send("Error streaming audio");
    }
});

// Dynamic port for Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





/* const express = require("express");
const cors = require("cors");
const ytSearch = require("yt-search");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
app.use(cors());

// 🔍 Search only MP3 (music) and filter out videos
app.get("/search", async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).send("Query is required");

        console.log("Searching for:", query);

        const result = await ytSearch(query);
        const songs = result.videos.filter(video =>
            video.title.toLowerCase().includes("official audio") || 
            video.title.toLowerCase().includes("lyrics") || 
            video.title.toLowerCase().includes("song")
        );

        res.json(songs);
    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).send("Error fetching search results");
    }
});

// 🎵 Stream YouTube audio in real-time with low latency
const { PassThrough } = require("stream");

app.get("/stream", async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).send("URL is required");

        console.log("Streaming:", videoUrl);

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Transfer-Encoding", "chunked");

        // Fetch lowest quality audio for instant playback
        const stream = ytdl(videoUrl, {
            filter: "audioonly",
            quality: "lowestaudio", // Use lowest quality to reduce data
            dlChunkSize: 1024 * 512, // Reduce chunk size for real-time streaming
            highWaterMark: 1024 * 256, // Lower buffer to avoid pre-downloading
        });

        const passThrough = new PassThrough();
        stream.pipe(passThrough); // Stream audio without waiting

        passThrough.pipe(res, { end: true });

        // Stop the stream if the client disconnects
        res.on("close", () => {
            console.log("Client disconnected, stopping stream...");
            passThrough.destroy();
        });

    } catch (error) {
        console.error("Streaming Error:", error.message);
        if (!res.headersSent) res.status(500).send("Error streaming audio");
    }
});




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));   */
