import { ClaimsIdentity } from "./ClaimsIdentity";

export type JwtTokenResult = {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpireAt: string;
}

export type ParsedTokenData = {
    claims: Array<Claim>;
    accessToken: string;
    accessTokenExpireAt: string;
    refreshToken: string;
    refreshTokenExpireAt: string;
}

export type JwtKeyValuePair = {
    key: string;
    value: string;
}

export type AuthenticationResponse = JwtTokenResult & {
}

export type AdditionalData = {
    secondaryKeys: Array<JwtKeyValuePair>;
}

export type Claim = {
    type: string;
    value: string;
}

export type ClaimsPrincipal = {
    identity: ClaimsIdentity;
}

export type AuthenticationState = {
    user: ClaimsPrincipal;
}

export type BooleanResponse = {
    result: boolean;
}

export type TokenRequest = AdditionalData & {
    refreshTokenString: string;
}
