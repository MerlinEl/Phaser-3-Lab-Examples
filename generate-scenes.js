// v terminále spusť: node generate-scenes.js

const fs = require("fs");
const path = require("path");

const scenesDir = path.join(__dirname, "scenes");
const outputFile = path.join(__dirname, "docs", "scenes.json");

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

function buildIndex() {
    let categories = {};

    fs.readdirSync(scenesDir, { withFileTypes: true }).forEach((entry) => {
        if (entry.isDirectory()) {
            const catName = entry.name;
            const catPath = path.join(scenesDir, catName);

            const files = fs
                .readdirSync(catPath)
                .filter((f) => f.endsWith(".js"))
                .map((f) => ({
                    name: formatName(f),
                    file: "scenes/" + catName + "/" + f,
                }));

            if (files.length > 0) {
                categories[catName] = files;
            }
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(categories, null, 2));
    console.log("✅ scenes.json vygenerován do", outputFile);
}

buildIndex();
