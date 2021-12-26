const CURRENT_PLAYING_LABEL = "current";

window.addEventListener("DOMContentLoaded", (event) => {
    // 初期化

    let playerElem = document.getElementById("player");
    let playlistBackwardElem = document.getElementById("playlist-backward");
    let playlistForwardElem = document.getElementById("playlist-forward");

    playerElem.addEventListener("ended", () => {
        playForward();
    });

    playlistBackwardElem.addEventListener("click", () => {
        playBackward();
    });

    playlistForwardElem.addEventListener("click", () => {
        playForward();
    });
});

const getCurrentIndex = (reverse = false) => {
    console.log("getCurrentItem", reverse);

    let playlistItemElems = document.getElementById("playlist-table").getElementsByTagName("tr");
    let playlistCurrentItemElems = document.getElementsByClassName(CURRENT_PLAYING_LABEL);

    if (playlistItemElems.length > 0 && playlistCurrentItemElems.length > 0) {
        return ([].slice.call(playlistItemElems)).indexOf(playlistCurrentItemElems[0]);
    } else {
        return reverse ? playlistItemElems.length : -1;
    }
};

const playN = (index) => {
    console.log("playN", index);

    let playlistCurrentItemElems = document.getElementsByClassName(CURRENT_PLAYING_LABEL);
    Array.prototype.forEach.call(playlistCurrentItemElems, function (element) {
        element.classList.remove(CURRENT_PLAYING_LABEL);
    });

    let playlistItemElems = document.getElementById("playlist-table").getElementsByTagName("tr");
    let playlistItemElemsArray = [...playlistItemElems];
    if (playlistItemElemsArray && playlistItemElemsArray.length > 0) {
        console.log("playN playlistItemElemsArray", playlistItemElemsArray);

        playlistItemElemsArray[index].classList.add(CURRENT_PLAYING_LABEL);

        var audio = document.getElementById('player');
        audio.src = document.querySelectorAll('tr.current td audio')[0].src;
        audio.play();
    }
};

const playForward = () => {
    console.log("playForward");

    playNext(true);
};

const playBackward = () => {
    console.log("playBackward");

    playNext(false);
};

const playNext = (isForward = true) => {
    console.log("playNext", isForward);

    let nextIndex = getCurrentIndex() + (isForward ? 1 : -1);
    let playlistItemElems = document.getElementById("playlist-table").getElementsByTagName("tr");

    if (nextIndex < 0) {
        nextIndex = playlistItemElems.length - 1;
    } else if (nextIndex >= playlistItemElems.length) {
        nextIndex = 0;
    }

    playN(nextIndex);
};
