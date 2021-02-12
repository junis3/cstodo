import fs from "fs";
import getCurrentHistory from "./etc/getCurrentHistory";
import { addHistory, HistoryType } from './database/history';

// Make empty 'filename' file on project root if it does not exist
const makeEmptyFile = async (fileName: string) => {
    await new Promise<void>((resolve, reject) => fs.readFile(fileName, 'UTF-8', (err) => {
        if (err && err.code === 'ENOENT') {
            fs.writeFile(fileName, '', 'UTF-8', (err) => {
                if (err) reject(err);
                resolve();
            });
        }
    }));   
}

export const preprocess = async () => {
    let history = await getCurrentHistory();

    await Promise.all(history.map(async (id) => addHistory({ id })));

    await Promise.all([
        makeEmptyFile('cstodo.txt'),
    ]);
}

preprocess();