if (window.BOQ_loadedInitialJS) {
    onJsLoad();
} else {
    document.getElementById('base-js').addEventListener('load', onJsLoad, false);
}