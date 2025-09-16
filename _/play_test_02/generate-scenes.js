// v terminále spusť: node generate-scenes.js

const fs = require("fs");
const path = require("path");

const SCENES_DIR = path.join(__dirname, "scenes");
const OUTPUT_FILE = path.join(__dirname, "scenes.json");

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

// prettier-ignore
// najdi všechny složky (kategorie)
const categories = fs.readdirSync(SCENES_DIR).filter(file =>
    fs.statSync(path.join(SCENES_DIR, file)).isDirectory()
);

let result = {};

// prettier-ignore
categories.forEach(category => {
    const files = fs.readdirSync(path.join(SCENES_DIR, category))
        .filter(file => file.endsWith(".js"));

    result[category] = files.map(file => ({
        name: formatName(file),
        file: `${category}/${file}`
    }));
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 4), "utf8");

console.log("✅ scenes.json bylo vygenerováno!");
