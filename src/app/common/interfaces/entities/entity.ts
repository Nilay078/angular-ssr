export interface Entity {
    id: number;
}

export interface KeyValue {
    key?: number | string;
    value: string;
}

export interface IdName extends Entity {
    name: string;
}

export interface Category {
    id: number;
    createDate: number;
    active: boolean;
    activationDate: number;
    name: string;
    keyword: string;
    description: string;
    order: number;
    path: string;
    displayPath: string;
    favorite: boolean;
    bindWithArticle: boolean;
    heroArticle: boolean;
    slug?: string;
}

export interface AccessCode extends Entity {
    accessCode: number;
    exclusiveCodeToken?: string;
}

export interface File {
    id: number;
    fileId: string;
    name: string;
    publicfile: boolean;
}
