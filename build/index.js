import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";


  const ROOT_PATH = join(dirname(import.meta.filename), '../notes')

function filePath2Link(filePath) {
    const link = "/" + relative(ROOT_PATH, filePath);
    const text = basename(filePath,extname(filePath));
    return { link, text }
}

function getSidbar() {
    const sidebar = {}
    const files = readdirSync(ROOT_PATH) || [];
    for (const file of files) {
        const fullPath = join(ROOT_PATH, file);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            sidebar[`/${file}/`] = getClassifySidbar(fullPath,[])
        }
    }
    return sidebar
}



function getClassifySidbar(dirPath, target) {
    const files = readdirSync(dirPath) || [];
    const items = [];
    let text
    for (const file of files) {
        const fullPath = join(dirPath, file);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            items.push(getClassifySidbar(fullPath,[]));
            text = basename(fullPath)
        }
        if (stats.isFile()) target.push(filePath2Link(fullPath))
    }   
    return target
}


function writeFileSyncWithDir(filePath, content) {
    // 获取文件所在的目录路径
    const dirPath = dirname(import.meta.filename);

    // 如果目录不存在，则递归创建目录
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true }); // recursive: true 表示递归创建所有缺失的父目录
    }
  
    // 同步写入文件，存在则覆盖（默认行为）
    writeFileSync(filePath, content, 'utf8');
  }

  function objectToCustomString(obj) {
    let str = `export const sidebar = ${JSON.stringify(sidebar)}`;
 
    return str;
  }
  
  const sidebar = getSidbar()
  const content = objectToCustomString(sidebar);
writeFileSyncWithDir(".vitepress/custom-config.js",content)