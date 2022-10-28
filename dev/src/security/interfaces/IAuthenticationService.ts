import { GenericEvent } from "jzo-library";
import { AdditionalData, AuthenticationResponse, ParsedTokenData } from "../data/types";
import { UserDataEventArgs } from "../data/UserDataEventArgs";
import { IAdditionalData } from "./IAdditionalData";

export interface IAuthenticationService {

    onUserAuthenticationStateChanged: GenericEvent<UserDataEventArgs>;

    get additionalData(): AdditionalData;

    authenticateUserAsync<TAuthCredentials extends IAdditionalData>(userCrdentials: TAuthCredentials): Promise<AuthenticationResponse>;

    logoutUserAsync(): Promise<boolean>;

    getCurrentUserInfoAsync(): Promise<ParsedTokenData>;

    validateTokenAsync(): Promise<boolean>;

    refreshTokenAsync(): Promise<ParsedTokenData>;

}