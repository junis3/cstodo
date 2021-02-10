import { model, Schema } from "mongoose";

export interface HistoryType {
    id: number;
    title: string;
    source: string;
    solveDate: Number;
}

const historySchema = new Schema({
    id: Number,
    title: { type: String, default: "" },
    source: { type: String, default: "" },
    solveDate: { type: Number, default: Date.now }
});

const History = model('history', historySchema, 'histories');
export default History;

export const getHistory2 = async () => await History.find();

export const addHistory = async ({id, title, source} : HistoryType) => {
    const history = new History({
        id, title, source
    });

    await history.save();
}