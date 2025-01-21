/*jshint esversion: 11 */
const fs = require('fs/promises');
const path = require('path');

const originalDirectoryPath = path.join(__dirname, 'files');
const copyDirectoryPath = path.join(__dirname, 'files-copy');

// новый вариант: проверка существования папки
async function checkDirectoryExist() {
  try {
    await fs.access(copyDirectoryPath); // проверка существования директории
    await removeDirectory(copyDirectoryPath);
  } catch (error) {}
  await startCopy();
}
checkDirectoryExist();

// удаляем директорию
async function removeDirectory(copyDirectoryPath) {
  try {
    await fs.rm(copyDirectoryPath, { recursive: true, force: true });
  } catch (error) {
    console.log(error);
  }
}

// создаём и копируем
async function startCopy() {
  try {
    await createDirectory(copyDirectoryPath);
    await copyDirectory(originalDirectoryPath, copyDirectoryPath);
  } catch (error) {
    console.log(error);
  }
}

// создание директории
async function createDirectory(directoryPath) {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    console.log(error);
  }
}
// блок копирования папки
async function copyDirectory(sourceDir, targetDir) {
  // читает и записывает асеты
  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);

      if (entry.isDirectory()) {
        const newDirPath = path.join(targetDir, entry.name);
        await createDirectory(newDirPath);
        await copyDirectory(sourcePath, newDirPath);
      } else if (entry.isFile()) {
        const targetPath = path.join(targetDir, entry.name);
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
