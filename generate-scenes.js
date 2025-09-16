// Vytvoří seznam scén do "docs/scenes.json", které se spouštějí přes play.html
// v terminále spusť: node generate-scenes.js

const fs = require("fs");
const path = require("path");

// funkce na převod názvu souboru na hezký titulek
function formatName(fileName) {
    return fileName
        .replace(".js", "")
        .replace(/[-_]/g, " ") // nahradí _ a - za mezery
        .replace(/\s+/g, " ") // odstraní dvojité mezery
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // první písmeno velké
        .join(" ");
}

const scenesDir = path.join(__dirname, "scenes");
const outputFile = path.join(__dirname, "docs", "scenes.json");
const docsSrcDir = path.join(__dirname, "docs", "src");
const assetLoaderSrc = path.join(__dirname, "src", "assetLoader.js");
const assetLoaderDest = path.join(docsSrcDir, "assetLoader.js");

function generateScenesJSON() {
    const categories = {};

    const categoriesDirs = fs.readdirSync(scenesDir);
    categoriesDirs.forEach((category) => {
        const categoryPath = path.join(scenesDir, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".js"));
            const formattedCategory = formatName(category); // 👈 formátování složek
            categories[formattedCategory] = files.map((file) => ({
                file: `scenes/${category}/${file}`,
                name: formatName(file),
            }));
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(categories, null, 2));
    console.log(`✅ Soubor scenes.json byl vygenerován: ${outputFile}`);
}
// zkopíruje assetLoader.js do složky docs/src/
// function copyAssetLoader() {
//     if (!fs.existsSync(docsSrcDir)) {
//         fs.mkdirSync(docsSrcDir, { recursive: true });
//     }
//     fs.copyFileSync(assetLoaderSrc, assetLoaderDest);
//     console.log(`✅ assetLoader.js zkopírován do: ${assetLoaderDest}`);
// }

// spusť obě funkce
generateScenesJSON();
// copyAssetLoader();
