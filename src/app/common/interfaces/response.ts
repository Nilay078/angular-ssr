import { Entity, KeyValue } from './entities/entity';

export interface Response {
    code: number;
    message: string;
    hasError: boolean;
    accessToken?: string;
    refreshToken?: string;
    deviceToken?: string;
}

export interface ViewResponse extends Response {
    view: Entity;
}

export interface ListResponse extends Response {
    list: Entity[];
    records: number;
    view: Entity;
}

export interface KeyValueResponse extends Response {
    list: KeyValue[];
    records: number;
}
