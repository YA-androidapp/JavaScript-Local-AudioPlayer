window.onload = function () {
    // 初期化

    let cancelElem = document.getElementById("modal-cancel");
    let closeElem = document.getElementById("modal-close");
    let dropArea = document.getElementById("drop-area");
    let fileElem = document.getElementById("files");
    let okElem = document.getElementById("modal-ok");

    cancelElem.addEventListener("click", () => {
        clearFiles();
    });

    closeElem.addEventListener("click", () => {
        clearFiles();
    });

    dropArea.addEventListener("click", () => {
        document.getElementById("files").click();
    });

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        document.getElementById("files").files = event.dataTransfer.files;
        updateSize(event.dataTransfer.files);
    });

    fileElem.addEventListener('change', (event) => {
        const fileList = event.target.files;
        if (fileList.length > 0) {
            updateSize(fileList);
        }
    });

    okElem.addEventListener("click", () => {
        const fileList = document.getElementById("files").files;
        if (fileList.length > 0) {
            getId3s(fileList);
        }
        clearFiles();
    });
};

function addTableRow(tableId, items, file) {
    var tableElem = document.getElementById(tableId);
    let ncol = 4;
    var trElem = document.createElement("tr");
    for (var i = 0; i < ncol; i++) {
        var tdElem = document.createElement("td");
        tdElem.textContent = items[i];
        trElem.appendChild(tdElem);
    }

    if (file.type.match(/audio\/*/)) {
        const audioElem = document.createElement('audio');
        audioElem.controls = true;
        const reader = new FileReader();
        reader.onload = (event) => {
            audioElem.src = event.target.result;
        }
        reader.readAsDataURL(file);
        var tdElem = document.createElement("td");
        tdElem.appendChild(audioElem);
        trElem.appendChild(tdElem);
    }

    tableElem.appendChild(trElem);
}

function clearFiles() {
    document.getElementById("files").value = null;
    document.getElementById("fileNum").innerHTML = "0";
    document.getElementById("fileSize").innerHTML = "0";
}

function getId3(file) {
    new id3().read(file, (function (data) {
        if (!data) { return; }
        if (typeof data.header === "undefined"
            || typeof data.frame === "undefined") { return; }
        addTableRow("playlist-table", [data.frame.artist, data.frame.album, data.frame.track, data.frame.title], file);
    }).bind(this));
}

function getId3s(fileList) {
    Array.from(fileList).forEach(function (file) {
        if (file.type.match(/audio\/*/)) {
            getId3(file);
        }
    });
}

function trimnullchar(str) {
    return str.replace(/\0.*$/g, "")
}

function updateSize(fileList) {
    let nBytes = 0,
        oFiles = fileList,
        nFiles = oFiles.length;
    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
        nBytes += oFiles[nFileId].size;
    }
    let sOutput = nBytes + " bytes";
    const aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    for (nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes.toLocaleString() + " bytes)";
    }
    document.getElementById("fileNum").innerHTML = nFiles;
    document.getElementById("fileSize").innerHTML = sOutput;
}
