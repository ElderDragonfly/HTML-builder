/*jshint esversion: 11 */
const fs = require('fs/promises');
const path = require('path');

const originalDirectoryPath = path.join(__dirname, 'files');
const copyDirectoryPath = path.join(__dirname, 'files-copy');

async function removeDirectory(directoryPath) {
    await fs.rm(directoryPath, { recursive: true, force: true });
}

async function createDirectory(directoryPath) {
    try {
        await fs.mkdir(directoryPath, { recursive: true });
    } catch (error) {
        console.log(error);
    }
}

async function readDirectory() {
    try {
        const originalDirectory = await fs.readdir(originalDirectoryPath);
        return originalDirectory;
    } catch (error) {
        console.log('error');
    }
}

async function checkDirectory() {
    try {
        const stats = await fs.stat(copyDirectoryPath); // пытается получить stat дирректории, и если она не существует, переходит в блок ошибки
        await removeDirectory(copyDirectoryPath);
        await createDirectory(copyDirectoryPath);
        await copyDirectory(copyDirectoryPath);
    } catch (error) {
        await createDirectory(copyDirectoryPath);
        await copyDirectory(copyDirectoryPath);
    }
}

async function copyDirectory(directoryPath) {
    try {
        const originalDirectoryArr = await readDirectory();
        for (const file of originalDirectoryArr) {
            const originalFilePath = path.join(originalDirectoryPath, file);
            const copyFilePath = path.join(directoryPath, file);
            await fs.copyFile(originalFilePath, copyFilePath);
        }
    } catch (error) {
        console.log('error');
    }
}

checkDirectory();

