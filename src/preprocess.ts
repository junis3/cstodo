import fs from "fs";
import { setHistory } from "./filesystem";
import getCurrentHistory from "./getCurrentHistory";

const preprocess = async () => {
    setHistory(await getCurrentHistory());

    await new Promise<void>((resolve, reject) => fs.readFile('cstodo.txt', 'UTF-8', (err) => {
        if (err && err.code === 'ENOENT') {
            fs.writeFile('cstodo.txt', '', 'UTF-8', (err) => {
                if (err) reject(err);
                resolve();
            });
        }
    }));   
}

preprocess();