const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const { PassThrough } = require("stream");

const app = express();
app.use(cors());

// Homepage Route
app.get("/", (req, res) => {
    res.send("🎵 YouTube Music Streaming API is Live! 🎶");
});

// Stream Route
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

// Dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
      
