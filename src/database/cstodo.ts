import { model, Schema, Document } from 'mongoose';
import { csGod } from '../config';

type StatusType = 'done' | 'pending' | 'failed';

export interface CstodoType {
  owner: string;
  content: string;
  status: StatusType;
  due: number;
  isPublic: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export type CstodoDocument = Document & CstodoType;

const cstodoSchema = new Schema({
  owner: { type: String, default: csGod },
  content: { type: String, required: true },
  status: { type: String, default: 'pending' },
  due: { type: Number, default: new Date().getTime() },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Number, default: new Date().getTime() },
  updatedAt: { type: Number, default: new Date().getTime() },
  createdBy: { type: String, default: 'unknown' },
});

// cstodoSchema.index({ owner: true, content: true }, { unique: true });

const Cstodo = model<CstodoDocument>('cstodo', cstodoSchema, 'cstodos');
export default Cstodo;

export const getCstodos = async (owner: string) => (await Cstodo.find({ owner, status: 'pending' })).sort((a, b) => a.due - b.due).map((doc) => doc.toObject() as CstodoType);

export const getCstodoInfo = async (content: string) => {
  const result = await Cstodo.findOne({ content }) as CstodoType | null;
  return result;
};

export const addCstodo = async (cstodo: Partial<CstodoType>) => {
  if (!cstodo.content || !cstodo.owner) return false;

  // eslint-disable-next-line no-param-reassign
  delete cstodo.createdAt;
  // eslint-disable-next-line no-param-reassign
  delete cstodo.updatedAt;

  //    if (await getCstodoInfo(cstodo.content)) return false;

  const result = await new Cstodo(cstodo).save();
  return result;
};

export const editCstodo = async (cstodo: Partial<CstodoType>, change: Partial<CstodoType>) => {
  if (!cstodo.content || !cstodo.owner || !cstodo.createdAt) return false;
  console.log(cstodo);
  console.log(Cstodo.findOne(cstodo));
  
  const result = await Cstodo.findOneAndUpdate({content: cstodo.content, owner: cstodo.owner, createdAt: cstodo.createdAt}, change);
  return result;
};

export const removeCstodo = async (cstodo: Partial<CstodoType>) => {
  if (!cstodo.owner || !cstodo.content) return false;

  const result = await Cstodo.findOneAndDelete(cstodo);
  return result;
};

export const updateCstodo = async (content: string, cstodo: Partial<CstodoType>) => {
  if (!content) return;

  // eslint-disable-next-line no-param-reassign
  delete cstodo.owner;
  // eslint-disable-next-line no-param-reassign
  delete cstodo.createdAt;
  // eslint-disable-next-line no-param-reassign
  delete cstodo.updatedAt;

  Cstodo.findOneAndUpdate({ content }, {
    $set: {
      ...cstodo,
      updatedAt: new Date().getTime(),
    },
  });
};
