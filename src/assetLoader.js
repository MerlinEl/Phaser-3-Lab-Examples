/**
 * Aby načítání souborů fungovalo jak lokálně, tak na GitHub Pages
 *  Nastavení
 *  do play.html přidej  <script src="../src/assetLoader.js"></script>
 *  Použití 
    function preload() {
        // varianta pro jeden soubor
        AssetUtils.loadAsset(this, "bg", "assets/images/purple-dots.png");

        // varianta pro více souborů
        AssetUtils.loadAssets(this, [
            { key: "timer_image", path: "assets/images/timer_bg_01.png" },
            { key: "CinemaCountdown", path: "src/CinemaCountdown.js", type: "script" }
        ]);
    }
*/
const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";

// base URL pro vzdálený repozitář
const REMOTE_BASE = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/";

// načte jeden asset
function loadAsset(scene, key, path, type = "image") {
    const localPath = "../" + path;
    const remotePath = REMOTE_BASE + path;

    if (IS_LOCAL) {
        scene.load[type](key, localPath);
    } else {
        scene.load[type](key, remotePath);
    }
}

// načte více assetů najednou
function loadAssets(scene, assets = []) {
    assets.forEach(({ key, path, type = "image" }) => {
        loadAsset(scene, key, path, type);
    });
}

// zpřístupnění pod jedním jménem
window.AssetUtils = {
    loadAsset,
    loadAssets,
};

/*
 * starý způsob load by type
 switch (type) {
        case "image":
            scene.load.image(key, finalUrl);
            break;
        case "script":
            scene.load.script(key, finalUrl);
            break;
        // případně další typy
*/
