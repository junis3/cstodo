import { model, Schema, Document } from "mongoose";

export const themeList = ['weeb', 'blob'] as const;
export type ThemeType = typeof themeList[number];

export function isThemeType(str: string) : str is ThemeType {
    return themeList.find((value) => value === str) !== undefined;
}

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
    autoRemove: boolean;
    muted: boolean;
    theme: ThemeType;
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
    autoRemove: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    theme: { type: String, default: false },
});

const User = model('user', userSchema, 'users');
export default User;

export const getUser = async (command: string) => {
    let user = await User.findOne({ command });
    
    if (user) return user.toObject() as UserType;
    else return undefined;
}

export const setTheme = async (command: string, theme: ThemeType) => {
    await User.findOneAndUpdate({ command }, { theme });
}  

export const setMuted = async (command: string, muted: boolean) => {
    await User.findOneAndUpdate({ command }, { muted });
}

export const setAutoRemove = async (command: string, autoRemove: boolean) => {
    await User.findOneAndUpdate({ command }, { autoRemove });
}

// ONLY DB OWNER CAN MANUALLY ADD/REMOVE/CHANGE CLIENTS MANUALLY BY MONGODB CLIENT.
// KKOWA?