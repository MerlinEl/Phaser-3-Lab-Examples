/**
 * Aby načítání souborů fungovalo jak lokálně, tak na GitHub Pages
 *  Použití 
    function preload() {
        // obrázky
        loadAsset(this, "timer_image", "assets/images/timer_bg_01.png", "image");
        loadAsset(this, "bg", "assets/images/purple-dots.png", "image");

        // skripty
        loadAsset(this, "CinemaCountdown", "src/CinemaCountdown.js", "script");
    }
*/
const IS_LOCAL = location.hostname === "localhost" || location.protocol === "file:";

// base URL pro vzdálený repozitář
const REMOTE_BASE = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/";

function loadAsset(scene, key, path, type = "image") {
    const localPath = path;
    const remotePath = REMOTE_BASE + path;

    if (IS_LOCAL) {
        scene.load[type](key, localPath);
    } else {
        scene.load[type](key, remotePath);
    }
}

// zajistí, že funkce bude vidět i globálně
window.loadAsset = loadAsset;

/*
 switch (type) {
        case "image":
            scene.load.image(key, finalUrl);
            break;
        case "script":
            scene.load.script(key, finalUrl);
            break;
        // případně další typy
*/
