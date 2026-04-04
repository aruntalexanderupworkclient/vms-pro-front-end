export interface OrganisationDto {
    id: string;
    type: string;
    typeId: string;
    typeLabel: string;
    name: string;
    address: string;
}

export interface CreateOrganisationDto {
    type: string;
    name: string;
    address: string;
}

export interface UpdateOrganisationDto {
    type: string;
    name: string;
    address: string;
}
