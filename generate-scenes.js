const fs = require("fs");
const path = require("path");

const scenesDir = path.join(__dirname, "scenes");
const outputFile = path.join(__dirname, "docs", "scenes.json");

// převod názvu souboru nebo adresáře na hezký titulek
function formatName(name) {
    return name
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
            const catName = formatName(entry.name); // formátovaný název kategorie
            const catPath = path.join(scenesDir, entry.name);

            const files = fs
                .readdirSync(catPath)
                .filter((f) => f.endsWith(".js"))
                .map((f) => ({
                    name: formatName(f),
                    file: "scenes/" + entry.name + "/" + f, // odkaz zůstává podle původní složky
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
