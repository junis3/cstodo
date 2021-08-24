import { model, Schema, Document } from "mongoose";

export interface UserType {
    id: string;
    name: string;
    command: string;
    userControl: 'whitelist' | 'blacklist';
    userWhitelist?: string[];
    userBlacklist?: string[];
    channelControl: 'whitelist' | 'blacklist';
    channelWhitelist?: string[];
    channelBlacklist?: string[];
}

export type UserDocument = Document & UserType;

const userSchema = new Schema<UserDocument>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    command: { type: String, required: true, unique: true },
    userControl: { type: String, default: 'blacklist' },
    userWhitelist: Array,
    userBlacklist: Array,
    channelControl: { type: String, default: 'blacklist' },
    channelWhitelist: Array,
    channelBlacklist: Array,
});

const User = model('user', userSchema, 'users');
export default User;

export const getUser = async (command: string) => {
    let result = await User.findOne({ command });
    
    if (result) return result.toObject() as UserType;
    else return undefined;
}

// ONLY DB OWNER CAN MANUALLY ADD/REMOVE/CHANGE CLIENTS MANUALLY BY MONGODB CLIENT.
// KKOWA?