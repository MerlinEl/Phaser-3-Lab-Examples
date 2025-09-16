// tools/labs_loader.js
(function () {
    // základní raw base URL (vrať tu svou)
    const REMOTE_BASE = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/";

    function qs(key) {
        try {
            return new URL(location.href).searchParams.get(key);
        } catch (e) {
            return null;
        }
    }

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = url;
            s.onload = () => resolve(url);
            s.onerror = (e) => reject(new Error("Failed to load script: " + url));
            document.head.appendChild(s);
        });
    }

    async function boot() {
        const sceneParam = qs("scene");
        if (!sceneParam) {
            console.error("labs_loader: chybí ?scene= parametr");
            return;
        }

        try {
            // 1) pokud AssetUtils není definované, načti assetLoader.js (z docs/src)
            if (!window.AssetUtils) {
                const assetLoaderUrl = REMOTE_BASE + "docs/src/assetLoader.js";
                console.log("labs_loader: načítám assetLoader:", assetLoaderUrl);
                await loadScript(assetLoaderUrl);
                console.log("labs_loader: assetLoader načteno");
            } else {
                console.log("labs_loader: AssetUtils již existuje, přeskočeno");
            }

            // 2) nyní načti vlastní scénu (sceneParam je relativní cesta jako "scenes/...js")
            const scenePath = decodeURIComponent(sceneParam);
            const sceneUrl = REMOTE_BASE + scenePath;
            console.log("labs_loader: načítám scénu:", sceneUrl);
            await loadScript(sceneUrl);
            console.log("labs_loader: scéna načtena:", sceneUrl);
        } catch (err) {
            console.error("labs_loader error:", err);
        }
    }

    boot();
})();
