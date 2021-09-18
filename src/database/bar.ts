import { model, Schema, Document } from "mongoose";
import { defaultBarOwner } from "../config";

export interface BarType {
    owner: string;
    content: string;
    progress: number;
    goal: number;
    isPublic: boolean;
    createdAt: number;
    updatedAt: number;
}

export type BarDocument = Document & BarType;

const barSchema = new Schema({
    owner: { type: String, default: defaultBarOwner },
    content: { type: String, required: true },
    progress: { type: Number, default: 0 },
    goal: {type: Number, default: 100 },
    isPublic: { type: Boolean, default: true },
    createdAt: { type: Number, default: new Date().getTime() },
    updatedAt: { type: Number, default: new Date().getTime() }
});

barSchema.index({ owner: true, content: true }, { unique: true });

const BarModel = model<BarDocument>('bar', barSchema, 'bars');
export default BarModel;

export const getBars = async (owner: string) => (await BarModel.find({ owner, status: 'pending' })).map((doc) => doc.toObject() as BarType);

export const getBarInfo = async (content : string) => {
    return await BarModel.findOne({ content }) as BarType | null;
}

export const addBar = async (bar : Partial<BarType>) => {
    if (!bar.content || !bar.owner) return false;

    delete bar.createdAt;
    delete bar.updatedAt;
    
    return !!await new BarModel(bar).save();
}

export const editBar = async (content: string, change: Partial<BarType>) => {
    return !!await BarModel.findOneAndUpdate({ content }, change, { useFindAndModify: true });
}

export const removeBar = async (bar: Partial<BarType>) => {
    if (!bar.owner || !bar.content) return false;
    
    return !!await BarModel.deleteOne(bar);
}

export const updateBar = async (content : string, bar: Partial<BarType>) => {
    if (!content) return;

    delete bar.owner;
    delete bar.createdAt;
    delete bar.updatedAt;
    
    BarModel.updateOne({ content }, {
        $set: {
            ...bar,
            updatedAt: new Date().getTime(),
        }
    });
}
