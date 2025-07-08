import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative } from "node:path";
import YAML from "yamljs";
import { Feature, SidebarItem } from "./types";


const ROOT_PATH = join(dirname(import.meta.filename), '../../notes')

function filePath2Link(filePath: string): SidebarItem {
    const link = "/" + relative(ROOT_PATH, filePath);
    const text = basename(filePath, extname(filePath));
    return { link, text }
}

function getSidbar() {
    const sidebar = {}
    const files = readdirSync(ROOT_PATH) || [];
    for (const file of files) {
        const fullPath = join(ROOT_PATH, file);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            sidebar[`/${file}/`] = getClassifySidbar(fullPath, [])
        }
    }
    return sidebar
}
function getYaml(indexPath: string) {
    const fileContent = readFileSync(indexPath, 'utf-8')
    const tempArr = fileContent.startsWith('---') ? fileContent.split("---") : null
    if (tempArr && tempArr.length > 2) {
        const features = fileContent.split("---")[1]
        return YAML.parse(features)
    }
    return
}

export const features:Feature[] = []
function setMainFeatures(indexPath: string) {
    const yaml = getYaml(indexPath)
    if (!yaml) return
    const { name, tagline } = yaml
    features.push({
        title: name,
        details: tagline,
        link: "/" + relative(ROOT_PATH, indexPath),
    })
}

function writeFeatures(features:Feature[]){
    const rootIndexPath = join(ROOT_PATH,'./index.md')
    const yaml = getYaml(rootIndexPath)
    yaml.features = features
    const reYmal ="---" + "\n" + YAML.stringify(yaml,4)+ "\n" + "---"
    try {
        writeFileSync(rootIndexPath, reYmal, 'utf8');
    } catch (error) {
        console.log(error);
        
    }
}

function getClassifySidbar(dirPath, target: SidebarItem[] | any[]) {
    const files = readdirSync(dirPath) || [];
    let text: string | undefined
    for (const file of files) {
        const fullPath = join(dirPath, file);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            const items = (getClassifySidbar(fullPath, []));
            text = basename(fullPath)
            target.push({ text, items })
        }
        if (stats.isFile()) {
            if (fullPath.endsWith("index.md")) {
                setMainFeatures(fullPath)
            } else {
                target.push(filePath2Link(fullPath))
            }
        }
    }
    return target
}
export const sidebar = getSidbar()
writeFeatures(features)


