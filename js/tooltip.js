window.addEventListener('DOMContentLoaded', (event) => {
    // 初期化

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[tooltip="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })

});
