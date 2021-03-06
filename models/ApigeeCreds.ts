export class ApigeeCreds {
    accessToken: string;
    accessTokenExpiresAt: number;

    constructor(accessToken: string = null, accessTokenExpiresAt: number = null) {
        this.accessToken = accessToken;
        this.accessTokenExpiresAt = accessTokenExpiresAt;
    }
}
