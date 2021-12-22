window.onload = function () {
    document.getElementById('file-select-input').addEventListener('change', (event) => {
        readFiles(event.target.files);
        event.target.files = null;
        event.target.value = null;
    });

    const dropArea = document.getElementById('drop-area');

    dropArea.addEventListener('click', () => {
        document.getElementById('file-select-input').click();
    });

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        readFiles(event.dataTransfer.files);
    });

    const readFiles = (files) => {
        if (files.length > 0) {
            Array.from(files).forEach(async function (file) {
                if (file.type.match(/audio\/*/)) {
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        audio.src = event.target.result;
                    }
                    reader.readAsDataURL(file);
                    const br = document.createElement('br');
                    document.getElementById('result').appendChild(audio);
                    document.getElementById('result').appendChild(br);
                }
            });
        }
    }
};
