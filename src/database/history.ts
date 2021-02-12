import { model, Schema } from "mongoose";

export interface HistoryType {
    id: number;
    title?: string;
    source?: string;
    solveTimestamp?: number;
    level?: string;
}

const historySchema = new Schema({
    id: Number,
    title: { type: String, default: "" },
    source: { type: String, default: "" },
    solveDate: { type: Number, default: Date.now }
});

const History = model('history', historySchema, 'histories');
export default History;

export const getHistories = async () => (await History.find()).map((doc) => doc.toObject() as HistoryType);

export const getHistoryInfo = async (id : number) => {
    const result = await History.find({ id });
    if (result.length === 0) return undefined;
    return result[0].toObject() as HistoryType;
}

export const addHistory = async ({id, title, source} : HistoryType) => {
    let nowTimestamp = Date.now();

    if (getHistoryInfo(id)) return false;

    await new History({
        id, 
        title: title || '', 
        source: source || '', 
        solveTimestamp: nowTimestamp,
    }).save();

    return true;
}

export const removeHistory = async (id : number) => {
    if (!id) return;
    
    await History.deleteOne({ id });
}
