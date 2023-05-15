import * as fs from "fs";

const allFiles = [];

const files = fs.readdirSync("./");

for (const file of files) {
  getFiles(file);
}

function getFiles(initialPath) {
  if (fs.statSync(initialPath).isDirectory()) {
    const files = fs.readdirSync(initialPath);
    for (const file of files) {
      getFiles(`${initialPath}/${file}`);
    }
  } else {
    if (initialPath.endsWith(".png")) {
      allFiles.push(`<link rel="preload" href="/${initialPath}" as="image">`);
    }
  }
}

console.log(allFiles.join("\n"));
