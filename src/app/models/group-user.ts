import {User} from './user';

export interface GroupUser {
    groupName: string;
    users: User[];
}