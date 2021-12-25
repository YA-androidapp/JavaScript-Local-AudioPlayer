window.addEventListener('DOMContentLoaded', (event) => {
    // 初期化

    let playerElem = document.getElementById("player");
    let playlistBackwardElem = document.getElementById("playlist-backward");
    let playlistForwardElem = document.getElementById("playlist-forward");

    playerElem.addEventListener("ended", () => {
        playNext();
    });

    playlistBackwardElem.addEventListener("click", () => {
        playPrevious();
    });

    playlistForwardElem.addEventListener("click", () => {
        playNext();
    });
});

const playPrevious = () => {
    console.log("previous");
};

const playNext = () => {
    console.log("next");
};