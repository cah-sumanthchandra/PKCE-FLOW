import {Profile} from './profile';

export interface OktaAppsAndGroups {
    name?: string;
    appId?: string;
    label?: string;
    groupId?: string;
    profile?: Profile;
}