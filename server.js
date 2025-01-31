const express = require("express");
const YouTubeMusic = require("node-youtube-music");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow frontend access
app.use(express.static("public")); // Serve frontend files

app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
        const results = await YouTubeMusic.searchMusics(query);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch music data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
