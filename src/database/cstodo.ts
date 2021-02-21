import { model, Schema, Document } from "mongoose";

type StatusType = 'done' | 'pending' | 'failed';

export interface CstodoType {
    content: string;
    status?: StatusType;
}

export type CstodoDocument = Document & CstodoType;

const cstodoSchema = new Schema({
    content: { type: String, unique: true, required: true },
    status: { type: String, default: "pending"},
});

const Cstodo = model<CstodoDocument>('cstodo', cstodoSchema, 'cstodos');
export default Cstodo;

export const getCstodos = async () => (await Cstodo.find({ status: 'pending' })).map((doc) => doc.toObject() as CstodoType);

export const getCstodoInfo = async (content : string) => {
    return await Cstodo.findOne({ content }) as CstodoType | null;
}

export const addCstodo = async ({content, status} : CstodoType) => {
    if (await getCstodoInfo(content)) return false;
    
    await new Cstodo({
        content,
        status: status || 'pending',
    }).save();

    return true;
}

export const removeCstodo = async (content : string) => {
    if (!content) return;
    
    await Cstodo.deleteOne({ content });
}

export const shuffleCstodo = async () => {
    let cstodo = await getCstodos();
    let halfPoint = Math.floor(cstodo.length / 2);

    let cstodoLeft = cstodo.slice(0, halfPoint).map(x => ({key: Math.random(), value: x})).sort((a, b) => a.key - b.key).map(p => p.value);
    let cstodoRight = cstodo.slice(halfPoint).map(x => ({key: Math.random(), value: x})).sort((a, b) => a.key - b.key).map(p => p.value);

    await Cstodo.deleteMany({ status: 'pending' });

    await Promise.all(cstodoLeft.map((value) => new Cstodo(value).save()));
    await Promise.all(cstodoRight.map((value) => new Cstodo(value).save()));
}

export const changeCstodoStatus = async (content : string, status: StatusType) => {
    if (!content) return;
    
    Cstodo.updateOne({ content }, {
        $set: {
            status,
        }
    });
}
