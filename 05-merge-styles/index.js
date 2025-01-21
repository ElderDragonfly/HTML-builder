/*jshint esversion: 11 */
const fs = require('fs/promises');
const path = require('path');

const bundlePath = path.join(__dirname, './project-dist/bundle.css');
const stylesPath = path.join(__dirname, 'styles');

async function createFile(filePath, data) {
  try {
    await fs.writeFile(filePath, data, 'utf8');
  } catch (error) {
    console.log('error in createFile');
  }
}
createFile(bundlePath, '');
readStylesDirectory(stylesPath, bundlePath);

async function readStylesDirectory(sourceDir, targetFilePath) {
  // читает и записывает стили
  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);

      if (entry.isDirectory()) {
        await readStylesDirectory(sourcePath, targetFilePath);
      } else if (entry.isFile() && path.extname(entry.name) === '.css') {
        const data = await fs.readFile(sourcePath, 'utf8');
        await fs.appendFile(targetFilePath, data);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
