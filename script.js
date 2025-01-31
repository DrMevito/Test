const BASE_URL = "https://test-r1wz.onrender.com"; // Replace with your Render URL

async function searchSongs() {
    const query = document.getElementById("searchQuery").value;
    if (!query) return alert("Enter a search term!");

    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    const songs = await response.json();

    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    songs.forEach(song => {
        const li = document.createElement("li");
        li.innerHTML = `<button onclick="playSong('${song.url}')">${song.title}</button>`;
        resultsList.appendChild(li);
    });
}

async function playSong(url) {
    console.log("Playing song:", url);
    const player = document.getElementById("player");

    player.src = `${BASE_URL}/stream?url=${encodeURIComponent(url)}`;
    player.play().catch(error => console.error("Playback error:", error));
}









/*old code for termux*/

/* async function searchSongs() {
    const query = document.getElementById("searchQuery").value;
    if (!query) return alert("Enter a search term!");

    const response = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
    const songs = await response.json();

    const resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    songs.forEach(song => {
        const li = document.createElement("li");
        li.innerHTML = `<button onclick="playSong('${song.url}')">${song.title}</button>`;
        resultsList.appendChild(li);
    });
}

async function playSong(url) {
    console.log("Playing song:", url);
    const player = document.getElementById("player");

    player.src = `http://localhost:3000/stream?url=${encodeURIComponent(url)}`;
    player.play().catch(error => console.error("Playback error:", error));
}

// Update progress bar
const player = document.getElementById("player");
player.addEventListener("timeupdate", () => {
    const progress = document.getElementById("progress");
    progress.value = (player.currentTime / player.duration) * 100;
});

// Seek function to jump to a specific time
function seek(event) {
    const progress = document.getElementById("progress");
    const seekTime = (event.target.value / 100) * player.duration;
    player.currentTime = seekTime;
} */
