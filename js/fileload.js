const WAIT_INTERVAL = 100;
let dataTransfer = new DataTransfer();

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

    dropArea.addEventListener("drop", async (event) => {
        dataTransfer = new DataTransfer();

        let items = event.dataTransfer.items;

        event.preventDefault();

        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();

            if (item) {
                await scanFiles(item, dataTransfer);
            }
        }
        while (true) {
            if (dataTransfer.files.length > 0) {
                waitForFileList(dataTransfer.files);
                break;
            }
            await _sleep(WAIT_INTERVAL);
        }
    }, false);

    fileElem.addEventListener('change', (event) => {
        const fileList = document.getElementById("files").files;
        if (fileList.length > 0) {
            getMetadata();
        }
    });

    okElem.addEventListener("click", () => {
        checkAndLoadfiles();
    });
});

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitForFileList = (fileList) => {
    document.getElementById("files").files = fileList;
    checkAndGetMetadata();
}

const checkAndGetMetadata = () => {
    console.log("checkAndGetMetadata()");
    const fileList = document.getElementById("files").files;

    if (fileList && fileList.length > 0) {
        document.getElementById("files").files = fileList;
        getMetadata(fileList);
    } else {
        setTimeout(() => { checkAndGetMetadata(fileList) }, WAIT_INTERVAL);
    }
}

const checkAndPlayForward = () => {
    playForward();
    clearFiles();
}

const checkAndLoadfiles = () => {
    const fileList = document.getElementById("files").files;

    if (fileList && fileList.length > 0) {
        loadFiles();

        let playlistItemElems = document.getElementById("playlist-table").getElementsByTagName("tr");
        if (playlistItemElems.length > 0) {
            checkAndPlayForward();
        } else {
            setTimeout(() => { checkAndPlayForward() }, WAIT_INTERVAL);
        }
    } else {
        setTimeout(() => { checkAndLoadfiles() }, WAIT_INTERVAL);
    }
}

const getFile = async (fileEntry) => {
    try {
        return await new Promise((resolve, reject) => fileEntry.file(resolve, reject));
    } catch (err) {
        console.log(err);
    }
}

const scanFiles = async (item, dataTransfer) => {
    console.log("item", item);

    if (item.isDirectory) {
        console.log("dir", item);
        let directoryReader = item.createReader();
        directoryReader.readEntries(function (entries) {
            entries.forEach(function (entry) {
                scanFiles(entry, dataTransfer);
            });
        });
    } else if (item.isFile) {
        let file = await getFile(item);
        console.log("file", file);
        dataTransfer.items.add(file);
        console.log("dataTransfer", dataTransfer);
    }
}

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
        audioElem.className = "hidden";
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

const loadFiles = () => {
    const fileList = document.getElementById("files").files;

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

const getMetadata = () => {
    const fileList = document.getElementById("files").files;

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
