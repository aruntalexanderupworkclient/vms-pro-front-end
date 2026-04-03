export enum MdmType {
    VisitStatus = 'VisitStatus',
    UserStatus = 'UserStatus',
    TokenType = 'TokenType',
    OrganisationType = 'OrganisationType'
}

export interface MdmDto {
    id: string;
    code: string;
    value: string;
    sortOrder: number;
    isActive: boolean;
}

export interface CreateMdmDto {
    code: string;
    value: string;
    sortOrder: number;
    isActive: boolean;
}

export interface UpdateMdmDto {
    code: string;
    value: string;
    sortOrder: number;
    isActive: boolean;
}
