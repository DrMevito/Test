const apiUrl = "/search";
let currentAudio = document.getElementById("audioPlayer");
const progressFill = document.getElementById("progressFill");
const playPauseBtn = document.getElementById("playPauseBtn");
let currentTrack = null;

async function searchMusic() {
    const query = document.getElementById("searchQuery").value;
    const response = await fetch(`${apiUrl}?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    const musicList = document.getElementById("musicList");
    musicList.innerHTML = "";

    data.forEach(item => {
        const songElement = document.createElement("div");
        songElement.classList.add("song");
        songElement.innerText = item.title;
        songElement.onclick = () => playMusic(item);
        musicList.appendChild(songElement);
    });
}

function playMusic(track) {
    if (currentTrack && currentTrack.youtubeId === track.youtubeId) {
        togglePlayPause();
        return;
    }

    currentTrack = track;
    currentAudio.src = `https://www.youtube.com/watch?v=${track.youtubeId}`;
    currentAudio.play();
    playPauseBtn.innerText = "⏸️ Pause";
}

function togglePlayPause() {
    if (!currentAudio.src) return;

    if (currentAudio.paused) {
        currentAudio.play();
        playPauseBtn.innerText = "⏸️ Pause";
    } else {
        currentAudio.pause();
        playPauseBtn.innerText = "▶️ Play";
    }
}

function updateProgressBar() {
    if (!currentAudio.duration) return;

    const progressPercent = (currentAudio.currentTime / currentAudio.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
}

function resetPlayer() {
    playPauseBtn.innerText = "▶️ Play";
    progressFill.style.width = "0%";
}
