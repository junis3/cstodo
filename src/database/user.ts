import { model, Schema, Document } from "mongoose";
import { addAlarm } from "./alarm";
import { getCstodos } from "./cstodo";

export const themeList = ['weeb', 'blob'] as const;
export type ThemeType = typeof themeList[number];

export const controlList = ['whitelist', 'blacklist'] as const;
export type ControlType = typeof controlList[number];

export const useFeatureList = ['always', 'optional', 'never'] as const;
export type UseFeatureType = typeof useFeatureList[number];


export function isThemeType(str: string) : str is ThemeType {
    return themeList.find((value) => value === str) !== undefined;
}

export interface UserType {
    id: string;
    name: string;
    command: string;
    owner?: string;
    home?: string;
    taskType: 'todo' | 'bar';
    userControl: ControlType;
    userWhitelist?: string[];
    userBlacklist?: string[];
    channelControl: ControlType;
    channelWhitelist?: string[];
    channelBlacklist?: string[];
    useDue: UseFeatureType;
    usePriority: UseFeatureType;
    useBar: UseFeatureType;
    useAlarm: UseFeatureType;
    autoRemove: boolean;
    muted: boolean;
    theme: ThemeType;
}

export type UserDocument = Document & UserType;

const userSchema = new Schema<UserDocument>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    command: { type: String, required: true, unique: true },
    owner: { type: String },
    taskType: { type: String, required: true, default: 'todo' },
    userControl: { type: String, default: 'blacklist' },
    userWhitelist: Array,
    userBlacklist: Array,
    channelControl: { type: String, default: 'blacklist' },
    channelWhitelist: Array,
    channelBlacklist: Array,
    useDue: { type: String, default: 'never' },
    usePriority: { type: String, default: 'never' },
    useBar: { type: String, default: 'never' },
    useAlarm: { type: String, default: 'never' },
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

export const getAllUsers = async () => {
    return (await User.find({ })).map((userDocument) => userDocument.toObject() as UserType);
}

export const setOwner = async (command: string, owner: string) => {
    await User.findOneAndUpdate({ command }, { owner }, { useFindAndModify: true });
}

export const setHome = async (command: string, home: string) => {
    await User.findOneAndUpdate({ command }, { home }, { useFindAndModify: true });
}

export const setTheme = async (command: string, theme: ThemeType) => {
    await User.findOneAndUpdate({ command }, { theme }, { useFindAndModify: true });
}  

export const setMuted = async (command: string, muted: boolean) => {
    await User.findOneAndUpdate({ command }, { muted }, { useFindAndModify: true });
}

export const setAutoRemove = async (command: string, autoRemove: boolean) => {
    await User.findOneAndUpdate({ command }, { autoRemove }, { useFindAndModify: true });
}

export const setUseDue = async (command: string, useDue: UseFeatureType) => {
    await User.findOneAndUpdate({ command }, { useDue }, { useFindAndModify: true });
}

export const setUsePriority = async (command: string, usePriority: UseFeatureType) => {
    await User.findOneAndUpdate({ command }, { usePriority }, { useFindAndModify: true });
}

export const setUseBar = async (command: string, useBar: UseFeatureType) => {
    await User.findOneAndUpdate({ command }, { useBar }, { useFindAndModify: true });
}

export const setUseAlarm = async (command: string, useAlarm: UseFeatureType) => {
//    const user = await User.findOne({ command });
//    if (!user) return;

//    const oriUseAlarm = user.useAlarm;
    await User.findOneAndUpdate({ command }, { useAlarm }, { useFindAndModify: true });
}

// ONLY DB OWNER CAN MANUALLY ADD/REMOVE/CHANGE CLIENTS MANUALLY BY MONGODB CLIENT.
// KKOWA?