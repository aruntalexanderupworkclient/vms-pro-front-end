export interface Token {
    id: string;
    tokenNo: string;
    visitorId: string;
    visitorName: string;
    type: string;
    typeId: string;
    issueTime: Date;
    expiry: Date;
    status: string;
    statusId: string;
    hostName: string;
}


export interface TokenType {
    // id: string;
    type: string;
    icon: string;
    description: string;
}

export interface ScanTokenDto {
    Name: string;
    Token: string;
    Status: string;
}

export class TokenType {
    constructor(init?: Partial<TokenType>) {
        Object.assign(this, init);
    }
}

export class Token {
    constructor(init?: Partial<Token>) {
        Object.assign(this, init);
    }
}

export class ScanTokenDto {
    constructor(init?: Partial<ScanTokenDto>) {
        Object.assign(this, init);
    }
}