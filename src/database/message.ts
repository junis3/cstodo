import { model, Schema, Document } from 'mongoose';

export interface MessageType {
  event: object;
  blobawwFired: boolean;
}

export type MessageDocument = Document & MessageType;

const historySchema = new Schema<MessageDocument>({
  event: Object,
  blobawwFired: { type: Boolean, default: false },
});

const Message = model('message', historySchema, 'messages');
export default Message;

export const addMessage = async ({ event, blobawwFired }: MessageType) => {
  await new Message({
    event,
    blobawwFired,
  }).save();

  return true;
};
