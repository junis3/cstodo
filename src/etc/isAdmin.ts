import {admins} from '../config';

export function isAdmin(userid: string): boolean {
    return admins.some((admin) => admin === userid);
}

export default isAdmin;