import { model, Schema, Document } from 'mongoose';
import { getAllUsers, getUser } from './user';
import isAdmin from '../etc/isAdmin';
import makeUnique from '../etc/makeUnique';
import { hasJSDocParameterTags } from 'typescript';

export interface HumanType {
    id: string;
    main_user?: string;
    users: string[];
    is_admin: boolean;
}

export type HumanDocument = Document & HumanType;

const humanSchema = new Schema<HumanDocument>({
    id: { type: String, required: true, unique: true},
    main_user: { type: String },
    users: Array,
});

const Human = model('human', humanSchema, 'humans');
export default Human;

export const getHuman = async (id: string) => {
    const human = await Human.findOne({ id });

    if(human) return human.toObject() as HumanType;
    return undefined;
}; 

export const upsertHuman = async (id: string) => {
    const human = await getHuman(id);
    const users = (await getAllUsers()).filter((user) => (user.owner === id)).map((user) => (user.command));
    if(human === undefined) {
        const newHuman = new Human({
            id,
            users,
        });
        await newHuman.save();
    } else {
        await Human.findOneAndUpdate({ id }, { users });
    }
};

export const setMainUser = async (id: string, main_user: string) => {
    const user = await getUser(main_user);
    if(user) {
        await Human.findOneAndUpdate({ id }, { main_user });
        return true;
    }
    return false;
};

export const setUsers = async (id: string, users: string[]) => {
    await Human.findOneAndUpdate({ id }, { users });
};

export const addUserToHuman = async (id: string, command: string) => {
    const human = await getHuman(id);
    if(human === undefined) return;
    const users = makeUnique(human.users.concat([ command ]));
    await Human.findOneAndUpdate({ id }, { users });
};

