export interface Token {
    id: number;
    tokenNo: string;
    visitorId: number;
    visitorName: string;
    type: string;
    issueTime: string;
    expiry: string;
    status: string;
    hostName: string;
}


export interface TokenType {
    // id: string;
    type: string;
    icon: string;
    description: string;
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