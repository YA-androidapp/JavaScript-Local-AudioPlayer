// Copyright (c) 2021 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.

window.addEventListener('DOMContentLoaded', (event) => {
    // 初期化

    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[tooltip="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

});
