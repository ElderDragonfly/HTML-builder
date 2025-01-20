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
readDirectory(stylesPath);

async function readDirectory(directoryPath) {
    try {
        const filesArray = await fs.readdir(directoryPath);
        const cssFiles = filesArray.filter(async (file) => { // фильтрую только файлы и расширение .css
            const filePath = path.join(stylesPath, file);
            const stats = await fs.lstat(filePath);
            return stats.isFile() && path.extname(file) === '.css';
        });
        await writeCSSData(cssFiles, bundlePath);
    } catch (error) {
        console.log('error in readDirectory');
    }
}

async function writeCSSData(array, finalFilePath) { // и проверяем и записываем
    try {
        for (const file of array) {
            const fileCSSPath = path.join(stylesPath, file); // путь к файлу
            const data = await fs.readFile(fileCSSPath, 'utf8'); // данные в файле
            await fs.appendFile(finalFilePath, data, 'utf8');
        }
    } catch (error) {
        console.log('error in writeCSSData');
    }
}