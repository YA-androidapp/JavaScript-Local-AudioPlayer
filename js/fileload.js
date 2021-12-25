window.addEventListener('DOMContentLoaded', (event) => {
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
        getMetadata(event.dataTransfer.files);
    });

    fileElem.addEventListener('change', (event) => {
        const fileList = event.target.files;
        if (fileList.length > 0) {
            getMetadata(fileList);
        }
    });

    okElem.addEventListener("click", () => {
        const fileList = document.getElementById("files").files;
        if (fileList.length > 0) {
            loadFiles(fileList);
            setTimeout(() => playForward(), 1000); // DOM変更待ち
        }
        clearFiles();
    });
});

const addTableRow = (tableId, items, file) => {
    console.log("addTableRow", tableId, items, file);
    
    let ncol = 4;
    let trElem = document.createElement("tr");
    for (var i = 0; i < ncol; i++) {
        let tdElem = document.createElement("td");
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
        let tdElem = document.createElement("td");
        tdElem.appendChild(audioElem);
        trElem.appendChild(tdElem);
    }

    document.getElementById(tableId).appendChild(trElem);
}

const clearFiles = () => {
    console.log("clearFiles");
    
    document.getElementById("files").value = null;
    document.getElementById("fileNum").innerHTML = "0";
    document.getElementById("fileSize").innerHTML = "0";
}

const getId3 = (file) => {
    console.log("getId3", file);
    
    new id3().read(file, (function (data) {
        if (!data) { return; }
        if (typeof data.header === "undefined"
            || typeof data.frame === "undefined") { return; }
        addTableRow("playlist-table", [data.frame.artist, data.frame.album, data.frame.track, data.frame.title], file);
    }).bind(this));
}

const loadFiles = (fileList) => {
    console.log("loadFiles", fileList);
    
    Array.from(fileList).forEach(function (file) {
        if (file.type.match(/audio\/*/)) {
            getId3(file);
        }
    });
}

const trimnullchar = (str) => {
    console.log("trimnullchar", str);
    
    return str.replace(/\0.*$/g, "")
}

const getMetadata = (fileList) => {
    console.log("getMetadata", fileList);
    
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
