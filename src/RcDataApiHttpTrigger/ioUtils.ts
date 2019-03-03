import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch';
import { logger } from './logger';

export function readAsJson(...args: string[]): any {
    let filePath = path.join(...args)
    let fileContent = fs.readFileSync(filePath, 'utf8')
    let obj = JSON.parse(fileContent)
    return obj
}

export function writeAsJson(data: any, ...args: string[]): any {
    fs.writeFile(path.join(...args), JSON.stringify(data), (err: NodeJS.ErrnoException) => { if (err) { logger.error(`Data saving failed: ${err}`) } })
    return data
}

export async function downloadAsJson(url: string): Promise<any> {
    logger.info(`Downloading data from url ${url}`)
    try {
        const response = await fetch(url)
        return await response.json()
    } catch (error) {
        logger.error(`Data download from url '${url}' failed on error: ${error}`)
    }
};