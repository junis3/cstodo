import { model, Schema, Document } from 'mongoose';
import { defaultBarOwner } from '../config';

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
  goal: { type: Number, default: 100 },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Number, default: new Date().getTime() },
  updatedAt: { type: Number, default: new Date().getTime() },
});

barSchema.index({ owner: true, content: true }, { unique: true });

const BarModel = model<BarDocument>('bar', barSchema, 'bars');
export default BarModel;

export const getBars = async (owner: string) => {
  const result = await BarModel.find({ owner });
  return result.map((doc) => doc.toObject() as BarType);
};

export const getBarInfo = async (content: string) => {
  const result = await BarModel.findOne({ content });
  return result?.toObject();
};

export const addBar = async (bar: Partial<BarType>) => {
  if (!bar.content || !bar.owner) return null;

  // eslint-disable-next-line no-param-reassign
  delete bar.createdAt;
  // eslint-disable-next-line no-param-reassign
  delete bar.updatedAt;

  const result = await new BarModel(bar).save();
  return result;
};

export const editBar = async (content: string, change: Partial<BarType>) => {
  const result = await BarModel.findOneAndUpdate({ content }, change);
  return result;
};

export const removeBar = async (bar: Partial<BarType>) => {
  if (!bar.owner || !bar.content) return null;

  const result = await BarModel.findOneAndDelete(bar);
  return result;
};

export const updateBar = async (content: string, bar: Partial<BarType>) => {
  if (!content) return;

  // eslint-disable-next-line no-param-reassign
  delete bar.owner;
  // eslint-disable-next-line no-param-reassign
  delete bar.createdAt;
  // eslint-disable-next-line no-param-reassign
  delete bar.updatedAt;

  BarModel.findOneAndUpdate({ content }, {
    $set: {
      ...bar,
      updatedAt: new Date().getTime(),
    },
  });
};
