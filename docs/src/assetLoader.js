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
(function (global) {
    // prettier-ignore
    const IS_LOCAL =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.protocol === "file:";

    const REMOTE_BASE = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/";

    function loadAsset(scene, key, path, type = "image") {
        const localPath = "../" + path;
        const remotePath = REMOTE_BASE + path;

        if (IS_LOCAL) {
            scene.load[type](key, localPath);
        } else {
            scene.load[type](key, remotePath);
        }
    }

    function loadAssets(scene, assets) {
        assets.forEach((asset) => loadAsset(scene, asset.key, asset.path, asset.type || "image"));
    }

    // zpřístupnit globálně
    global.AssetUtils = {
        loadAsset,
        loadAssets,
    };

    console.log("✅ AssetUtils načteno");
})(window);

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
