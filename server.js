const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const ytSearch = require("yt-search");
const { PassThrough } = require("stream");

const app = express();
app.use(cors());

// ✅ Homepage Route
app.get("/", (req, res) => {
    res.send("🎵 YouTube Music Streaming API is Live! 🎶");
});

// ✅ Search Route (Fetch only songs, not videos)
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

// ✅ Stream Route (Optimized for Real-Time Streaming)
app.get("/stream", async (req, res) => {
    try {
        let videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).send("URL is required");

        // Convert youtu.be URL to watch?v= format
        if (videoUrl.includes("youtu.be/")) {
            videoUrl = videoUrl.replace("youtu.be/", "www.youtube.com/watch?v=");
        }

        console.log("Streaming:", videoUrl);

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Transfer-Encoding", "chunked");

        // Stream only audio with real-time buffering
        const stream = ytdl(videoUrl, {
            filter: "audioonly",
            quality: "lowestaudio",
            highWaterMark: 1024 * 512, // Reduce buffering
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

// ✅ Dynamic Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
