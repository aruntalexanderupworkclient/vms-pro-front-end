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
    password?: string;
    roleId: string;
    roleName?: string;
    status: UserStatus;
    organisationId?: string;
    organisationName?: string;
    createdAt: string;
    updatedAt?: string;
}


export interface CreateUserDto {
    FullName: string;
    Email: string;
    Phone: string;
    Password: string;
    RoleId: string;
    OrganisationId: string | null;
}

export interface UpdateUserDto {
    FullName: string;
    Email: string;
    Phone: string;
    RoleId: string;
    Status: UserStatus;
    OrganisationId: string | null;
}
