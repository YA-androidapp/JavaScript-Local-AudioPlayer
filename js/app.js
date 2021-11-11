var fileelem = document.querySelector("[type='file']");

fileelem.addEventListener(
    "change",
    function () {
        const fileList = this.files;
        console.log(fileList);

        if (fileList.length > 0) {
            updateSize(fileList);
            getId3s(fileList);
        }
    },
    false
);

function trimnullchar(str) {
    return str.replace(/\0.*$/g, '')
}

function getId3s(fileList) {
    Array.from(fileList).forEach(function (file) {
        getId3(file);
    });
}

function getId3(file) {
    new id3().read(file, (function (data) {
        if (!data) { return; }
        if (typeof data.header === "undefined"
            || typeof data.frame === "undefined") { return; }
        console.log(data);
    }).bind(this));
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