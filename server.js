const express = require("express");
const ytSearch = require("yt-search");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const searchResults = await ytSearch(query);
        const songs = searchResults.videos
            .filter(video => video.duration.seconds > 0) // Only fetch songs
            .map(video => ({
                title: video.title,
                youtubeId: video.videoId,
                duration: video.timestamp,
                thumbnail: video.thumbnail
            }));

        res.json(songs);
    } catch (error) {
        console.error("Error fetching music data:", error);
        res.status(500).json({ error: "Failed to fetch music data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
