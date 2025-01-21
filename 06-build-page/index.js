/*jshint esversion: 11 */
const fs = require('fs/promises');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const projectStylesPath = path.join(__dirname, './project-dist/style.css');
const projectAssetsPath = path.join(__dirname, './project-dist/assets');
const projectIndexPath = path.join(__dirname, './project-dist/index.html');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const indexPath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');

// начало работы: проверка существования дирректории и удаление, если она существует. Запуск основной логики
async function checkMainDirectory() {
    try {
        await fs.access(projectDistPath);
        await fs.rmdir(projectDistPath, { recursive: true, force: true });
        await startApp();
    } catch (error) {
        startApp();
    }
}
checkMainDirectory();

async function startApp() {
    try {
        await createDirectory(projectDistPath);
        await createFile(projectStylesPath, '');
        await createDirectory(projectAssetsPath);
        await copyAssetsDirectory(assetsPath, projectAssetsPath);
        generareIndexHTML();
    } catch (error) {
        console.log(error);
    }
}

// общий блок работы с дирректориями
async function createDirectory(directoryPath) {
    try {
        await fs.mkdir(directoryPath, { recursive: true });
    } catch (error) {
        console.log(error);
    }
}

// блок работы со стилями
async function createFile(filePath, data) { // создаёт файл или очищает его, для перезаписи стилей
    try {
        await fs.writeFile(filePath, data, 'utf8');
        await readStylesDirectory(stylesPath, projectStylesPath);
    } catch (error) {
        console.log(error);
    }
}

async function readStylesDirectory(sourceDir, targetFilePath) { // читает и записывает стили
    try {
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        for(const entry of entries) {
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

// блок копирования папки assets
async function copyAssetsDirectory(sourceDir, targetDir) { // читает и записывает асеты
    try {
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        for(const entry of entries) {
            const sourcePath = path.join(sourceDir, entry.name);

            if (entry.isDirectory()) {
                const newDirPath = path.join(targetDir, entry.name);
                createDirectory(newDirPath);
                await copyAssetsDirectory(sourcePath, newDirPath);
            } else if (entry.isFile()) {
                const targetPath = path.join(targetDir, entry.name);
                await fs.copyFile(sourcePath, targetPath);

            }
        }
    } catch (error) {
        console.log(error);
    }

}

// блок замены компонентов
async function replaceTemplateTagWithComponent(HTMLData, tagName) {
    const regex = new RegExp(`{{${tagName}}}`, 'g');
    const componentPath = path.join(__dirname, 'components', `${tagName}.html`);

    try {
        const componentData = await fs.readFile(componentPath, 'utf8');
        return HTMLData.replace(regex, componentData);
    } catch (error) {
        console.log(`Error reading component ${tagName}: ${error.message}`);
        return HTMLData;  // Вернем HTML без изменений, если компонента не существует
    }
}

async function generareIndexHTML() {
    try {
        let sourceHTMLData = await fs.readFile(indexPath, 'utf8'); // копируем содержимое template в index в нужной папке

        const entries = await fs.readdir(componentsPath); // читаем template
        for (const entry of entries ) {
            const tag = path.parse(entry).name;
            sourceHTMLData = await replaceTemplateTagWithComponent(sourceHTMLData, tag);
        }

        await fs.writeFile(projectIndexPath, sourceHTMLData, 'utf8');


    } catch (error) {
        console.log(error);
    }
}
