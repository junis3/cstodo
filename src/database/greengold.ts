import { model, Schema, Document } from "mongoose";
import { HistoryType } from "./history";

export interface GreenGoldType {
    id?: number;
    username?: string;
    title?: string;
    sourcedTimestamp?: number;
}

export type GreenGoldDocument = Document & GreenGoldType;

const greengoldSchema = new Schema<GreenGoldDocument>({
    id: Number,
    username: String,
    title: String,
    sourcedTimestamp: {type: Number, default: Date.now },
});

const GreenGold = model('greengold', greengoldSchema, 'greengolds');
export default GreenGold;

export const getGreenGolds = async () => {
    return (await GreenGold.find()).map((doc) => doc.toObject() as GreenGoldType);
}

export const getLatestGreenGolds = async (username: string, numProblems: number) => {
    return await GreenGold.find({username: username}).sort({
        sourcedTimestamp: -1,
    }).limit(numProblems) as Array<GreenGoldType> | null;
}

export const addGreenGold = async(username: string, {id, title} : HistoryType) => {
    const nowTimestamp = Date.now();

    await new GreenGold({
        id,
        username,
        title: title || '',
        sourcedTimestamp: nowTimestamp,
    }).save();
}

export const greenGoldToHrefNoLevel = (problem: GreenGoldType) => {
    return `<http://icpc.me/${problem.id}|${problem.title}>`;
}