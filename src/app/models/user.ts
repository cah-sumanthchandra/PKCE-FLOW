import {Credential} from './credential';
import {Profile} from './profile';
import {Factor} from './factor';

export interface User {
    id: string;
    created: string;
    lastUpdated: string;
    status: string;
    statusChanged: string;
    scope: string;
    passwordChanged: string;
    lastLogin: Date;
    credentials: Credential;
    profile: Profile;
    factors: Factor[];
}