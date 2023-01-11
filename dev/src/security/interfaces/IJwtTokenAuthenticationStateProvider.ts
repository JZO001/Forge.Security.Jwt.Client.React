import { GenericEvent } from "jzo-library";
import { AuthenticationStateChangedEventArgs } from "../data/AuthenticationStateChangedEventArgs";
import { AuthenticationResponse, AuthenticationState, ParsedTokenData } from "../data/types";

export interface IJwtTokenAuthenticationStateProvider {

    PARSED_TOKEN_STORAGE_KEY: string;

    authenticationStateChanged: GenericEvent<AuthenticationStateChangedEventArgs>;

    getAuthenticationState(): AuthenticationState;

    authenticateUserWithAuthenticationResponse(authenticationResponse: AuthenticationResponse): void;

    authenticateUserWithParsedTokenData(parsedTokenData: ParsedTokenData): void;

    logout(): void;

    getParsedTokenData(): ParsedTokenData;

    parseToken(loginResponse: AuthenticationResponse): ParsedTokenData;

}