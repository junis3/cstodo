import { model, Schema, Document } from "mongoose";
import { csGod } from "../config";

type StatusType = 'done' | 'pending' | 'failed';

export interface CstodoType {
    owner: string;
    content: string;
    status: StatusType;
    due: number;
    isPublic: boolean;
    createdAt: number;
    updatedAt: number;
}

export type CstodoDocument = Document & CstodoType;

const cstodoSchema = new Schema({
    owner: { type: String, default: csGod },
    content: { type: String, unique: true, required: true },
    status: { type: String, default: "pending"},
    due: { type: Number, default: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2).getTime() },
    isPublic: { type: Boolean, default: true },
    createdAt: { type: Number, default: new Date().getTime() },
    updatedAt: { type: Number, default: new Date().getTime() }
});

const Cstodo = model<CstodoDocument>('cstodo', cstodoSchema, 'cstodos');
export default Cstodo;

export const getCstodos = async () => (await Cstodo.find({ status: 'pending' })).sort((a, b) => a.due - b.due).map((doc) => doc.toObject() as CstodoType);

export const getCstodoInfo = async (content : string) => {
    return await Cstodo.findOne({ content }) as CstodoType | null;
}

export const addCstodo = async (cstodo : Partial<CstodoType>) => {
    if (!cstodo.content) return false;

    delete cstodo.createdAt;
    delete cstodo.updatedAt;

    if (await getCstodoInfo(cstodo.content)) return false;
    
    await new Cstodo(cstodo).save();

    return true;
}

export const removeCstodo = async (content : string) => {
    if (!content) return;
    
    await Cstodo.deleteOne({ content });
}

export const shuffleCstodo = async () => {
    let cstodo = await getCstodos();

    let newCstodo = cstodo.map(x => ({key: Math.random(), value: x})).sort((a, b) => a.key - b.key).map(p => p.value);

    await Cstodo.deleteMany({ status: 'pending' });

    await Promise.all(newCstodo.map((value) => new Cstodo(value).save()));
}

export const updateCstodo = async (content : string, cstodo: Partial<CstodoType>) => {
    if (!content) return;

    delete cstodo.owner;
    delete cstodo.createdAt;
    delete cstodo.updatedAt;
    
    Cstodo.updateOne({ content }, {
        $set: {
            ...cstodo,
            updatedAt: new Date().getTime(),
        }
    });
}
