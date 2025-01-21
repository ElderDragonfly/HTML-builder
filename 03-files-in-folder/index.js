/*jshint esversion: 11 */
const { readdir, stat } = require('fs/promises');
const path = require('path');

const filePath = path.join(__dirname, 'secret-folder');

async function checkDirectory(somePath) {
  try {
    const directory = await readdir(somePath, { withFileTypes: true });
    for (const file of directory) {
      if (file.isFile()) {
        const secretFilePath = path.join(somePath, file.name);
        const stats = await stat(secretFilePath);
        const nameObj = path.parse(file.name);
        console.log(
          `${nameObj.name} - ${nameObj.ext.slice(1)} - ${stats.size} bites`,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}

checkDirectory(filePath);
