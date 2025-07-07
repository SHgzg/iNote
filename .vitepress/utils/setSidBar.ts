import { readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";


  const ROOT_PATH = join(dirname(import.meta.filename), '../../notes')

function filePath2Link(filePath:string):LinkItem {
    const link = "/" + relative(ROOT_PATH, filePath);
    const text = "/" + basename(filePath);
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

interface LinkItem {
    text?: string
    link?: string
    items?: LinkItem[]
}

function getClassifySidbar(dirPath, target:LinkItem[] | any[]) {
    const files = readdirSync(dirPath) || [];
    const items: any[] = [];
    let text:string | undefined
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

export const sidebar = getSidbar()