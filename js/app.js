window.onload = function () {
    // 初期化

    let fileElem = document.querySelector("[type='file']");
    let okElem = document.getElementById("modal-ok");

    fileElem.addEventListener(
        "change",
        function () {
            const fileList = this.files;
            if (fileList.length > 0) {
                updateSize(fileList);
            }
        },
        false
    );

    okElem.addEventListener(
        "click",
        function () {
            let fileElem = document.querySelector("[type='file']");
            const fileList = fileElem.files;
            if (fileList.length > 0) {
                getId3s(fileList);
                loadAudios(fileList)
            }
        },
        false
    );
};

function trimnullchar(str) {
    return str.replace(/\0.*$/g, '')
}

function addTableRow(tableId, items) {
    var tableElem = document.getElementById(tableId);
    let ncol = 4;
    var trElem = document.createElement('tr');
    for (var i = 0; i < ncol; i++) {
        var tdElem = document.createElement('td');
        tdElem.textContent = items[i];
        trElem.appendChild(tdElem);
    }
    tableElem.appendChild(trElem);
}

function addListItem(ulId, item) {
    var ulElem = document.getElementById(ulId);
    var liElem = document.createElement("li");
    liElem.className = "list-group-item";
    liElem.appendChild(document.createTextNode(item));
    ulElem.appendChild(liElem);
}

function getId3(file) {
    new id3().read(file, (function (data) {
        if (!data) { return; }
        if (typeof data.header === "undefined"
            || typeof data.frame === "undefined") { return; }
        console.log(data);
        // addListItem("playlist", data.frame.title);
        addTableRow("playlist-table", [data.frame.artist, data.frame.album, data.frame.track, data.frame.title]);
    }).bind(this));
}

function getId3s(fileList) {
    Array.from(fileList).forEach(function (file) {
        getId3(file);
    });
}

// TODO
function loadAudio(file) {
    console.log("file", file);
    var reader = new FileReader();
    reader.addEventListener('load', function () {
        var data = reader.result;
        console.log("file.name", file.name);
        player = new Player({
            title: file.name,
            src: data,
            format: file.name.split('.').pop().toLowerCase(),
            howl: null
        });
    });
    reader.readAsDataURL(file);
}

function loadAudios(fileList) {
    Array.from(fileList).forEach(function (file) {
        loadAudio(file);
    });
}

// https://developer.mozilla.org/ja/docs/Web/API/File/Using_files_from_web_applications
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
        sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    document.getElementById("fileNum").innerHTML = nFiles;
    document.getElementById("fileSize").innerHTML = sOutput;
}