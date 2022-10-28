import { JwtKeyValuePair } from "../data/types";

export class JwtClientAuthenticationCoreOptions {

    // Gets or sets the base address of the request. Leave it empty, if the current domain is used
    baseAddress: string = "";

    authenticationUri: string = "api/auth/login";
    logoutUri: string = "api/auth/logout";
    validateTokenUri: string = "api/auth/validate-token";
    refreshUri: string = "api/auth/refresh-token";

    // Gets or sets the additional data
    secondaryKeys: Array<JwtKeyValuePair> = [];

    // Gets or sets the value in milliseconds, when the service refresh the token before it expired
    refreshTokenBeforeExpirationInMilliseconds: number = 15000;

}
