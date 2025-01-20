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
        await checkFakeCSS(filesArray, bundlePath);
    } catch (error) {
        console.log('error in readDirectory');
    }
}

async function checkFakeCSS(array, finalFilePath) {
    try {
        for (const file of array) {
            const fileCSSPath = path.join(stylesPath, file);
            const data = await fs.readFile(fileCSSPath, 'utf8');
            if (/\{[\s\S]*?\}/.test(data)) {
                await fs.appendFile(finalFilePath, data, 'utf8');
            }
        }
    } catch (error) {
        console.log('error in checkFakeCSS');
    }
}








// async function writeFile(data, path) {
//     try {
//         await fs.writeFile(path, data)
//     } catch (error) {
//         console.log('error');
//     }
// }



// (async () => {
//     try {
//         const test = await readDirectory(stylesPath); // Ожидаем массив файлов
//         await checkFakeCSS(test); // Передаем массив в функцию
//     } catch (error) {
//         console.error('Unexpected error:', error);
//     }
// })();