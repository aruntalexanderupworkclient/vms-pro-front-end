export enum UserStatus {
    Active = 0,
    Inactive = 1,
    Suspended = 2,
    Deleted = 3
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    roleId: string;
    roleName?: string;
    status: UserStatus;
    organisationId?: string;
    organisationName?: string;
    createdAt: string;
    updatedAt?: string;
}
