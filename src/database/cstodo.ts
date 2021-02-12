import { model, Schema } from "mongoose";

type StatusType = 'done' | 'pending' | 'failed';

export interface CstodoType {
    content: string;
    status?: StatusType;
}

const cstodoSchema = new Schema({
    content: String,
    status: { type: String, default: "pending"},
});

const Cstodo = model('cstodo', cstodoSchema, 'cstodos');
export default Cstodo;

export const getCstodos = async () => (await Cstodo.find({ status: 'pending' })).map((doc) => doc.toObject() as CstodoType);

export const getCstodoInfo = async (content : string) => {
    const result = await Cstodo.find({ content });
    if (result.length === 0) return undefined;
    return result[0].toObject() as CstodoType;
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

export const changeCstodoStatus = async (content : string, status: StatusType) => {
    if (!content) return;
    
    Cstodo.updateOne({ content }, {
        $set: {
            status,
        }
    });
}
