import { model, Schema, Document } from "mongoose";

export interface HistoryType {
    id: number;
    title?: string;
    source?: string;
    solveTimestamp?: number;
    level?: string;
}

export type HistoryDocument = Document & HistoryType;

const historySchema = new Schema<HistoryDocument>({
    id: Number,
    title: { type: String, default: "" },
    source: { type: String, default: "" },
    solveDate: { type: Number, default: Date.now }
});

const History = model('history', historySchema, 'histories');
export default History;

export const getHistories = async () => (await History.find()).map((doc) => doc.toObject() as HistoryType);

export const getHistoryInfo = async (id : number) => {
    return await History.findOne({ id }) as HistoryType | null;
}

export const addHistory = async ({id, title, source} : HistoryType) => {
    const nowTimestamp = Date.now();

    if (await getHistoryInfo(id)) return false;

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
