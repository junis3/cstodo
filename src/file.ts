import fs from 'fs';

export const getCstodo = async () => {
    return new Promise<string[]>((resolve) => fs.readFile('cstodo.txt', 'utf-8', (error, data) => {
      if (error) throw error;
      resolve(data.split('\n'));
    }));
  }
  
export const setCstodo = async (cstodo : string[]) => {
    const realCstodo = cstodo.join('\n');
  
    return new Promise<void>((resolve) => fs.writeFile('cstodo.txt', realCstodo, 'utf-8', (error) => {
      if (error) throw error;
      resolve();
    }));
  }
  
export const getHistory = async () => {
    return new Promise<string[]>((resolve) => fs.readFile('history.txt', 'utf-8', (error, data) => {
      if (error) throw error;
      resolve(data.split('\n'));
    }));
  }
  
export const setHistory = async (history : string[]) => {
    const realHistory = history.join('\n');
  
    return new Promise<void>((resolve) => fs.writeFile('history.txt', realHistory, 'utf-8', (error) => {
      if (error) throw error;
      resolve();
    }));
  }
  