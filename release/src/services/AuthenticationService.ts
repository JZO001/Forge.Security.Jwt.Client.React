import { ArgumentNullException, GenericEvent } from "jzo-library";
import { AuthenticationStateChangedEventArgs } from "../data/AuthenticationStateChangedEventArgs";
import { ClaimsIdentity } from "../data/ClaimsIdentity";
import { ClaimTypes } from "../data/ClaimTypes";
import { HttpRequestException } from "../data/HttpRequestException";
import { AuthenticationResponse, BooleanResponse, JwtTokenResult, ParsedTokenData, TokenRequest } from "../data/types";
import { UserDataEventArgs } from "../data/UserDataEventArgs";
import { IAdditionalData } from "../interfaces/IAdditionalData";
import { IAuthenticationService } from "../interfaces/IAuthenticationService";
import { IJwtTokenAuthenticationStateProvider } from "../interfaces/IJwtTokenAuthenticationStateProvider";
import { ITokenizedApiCommunicationService } from "../interfaces/ITokenizedApiCommunicationService";
import { JwtClientAuthenticationCoreOptions } from "../options/JwtClientAuthenticationCoreOptions";

export class AuthenticationService implements IAuthenticationService {

    private readonly _apiService: ITokenizedApiCommunicationService;
    private readonly _authenticationStateProvider: IJwtTokenAuthenticationStateProvider;
    private readonly _additionalData: IAdditionalData;
    private readonly _options: JwtClientAuthenticationCoreOptions;

    public readonly onUserAuthenticationStateChanged: GenericEvent<UserDataEventArgs> = new GenericEvent<UserDataEventArgs>();

    constructor(apiService: ITokenizedApiCommunicationService,
        authenticationStateProvider: IJwtTokenAuthenticationStateProvider,
        additionalData: IAdditionalData,
        options: JwtClientAuthenticationCoreOptions) {
        if (apiService === null) throw new ArgumentNullException("apiService");
        if (authenticationStateProvider === null) throw new ArgumentNullException("authenticationStateProvider");
        if (options === null) throw new ArgumentNullException("options");
        this._apiService = apiService;
        this._authenticationStateProvider = authenticationStateProvider;
        authenticationStateProvider.authenticationStateChanged.addEventHandler(this.authenticationStateChangedEventHandler);
        this._additionalData = additionalData;
        this._options = options;
    }

    public get additionalData() { return this._additionalData; }

    public async authenticateUserAsync<TAuthCredentials extends IAdditionalData>(userCredentials: TAuthCredentials): Promise<AuthenticationResponse> {
        let result: AuthenticationResponse = null;

        try {
            userCredentials.secondaryKeys = this._additionalData.secondaryKeys;
            result = await this._apiService.postAsync<AuthenticationResponse>(this.combineUrlWithUri(this._options.baseAddress, this._options.authenticationUri), userCredentials);
            this._authenticationStateProvider.authenticateUserWithAuthenticationResponse(result);
        } catch (e) {
            await this.logoutUserAsync();
            result = {
                accessToken: "",
                refreshToken: "",
                refreshTokenExpireAt: new Date(1970, 1, 1, 1, 0, 0, 0).toUTCString()
            };
        }

        return result;
    }

    public async getCurrentUserInfoAsync(): Promise<ParsedTokenData> {
        const result: ParsedTokenData = this._authenticationStateProvider.getParsedTokenData();

        if (result === null) {
            await this.logoutUserAsync();
        }

        return new Promise<ParsedTokenData>((resolve, reject) => resolve(result));
    }

    public async logoutUserAsync(): Promise<boolean> {
        const parsedTokenData: ParsedTokenData = this._authenticationStateProvider.getParsedTokenData();
        let response: BooleanResponse = null;

        if (parsedTokenData.accessToken !== null && parsedTokenData.accessToken !== "") {
            try {
                response = await this._apiService.postAsync<BooleanResponse>(this.combineUrlWithUri(this._options.baseAddress, this._options.logoutUri), this._additionalData);
            } catch (e) {
                //console.log(e);
            }
        }

        try {
            this._authenticationStateProvider.logout();
        } catch (e) {
            //console.log(e);
        }

        return response === null ? false : response.result;
    }

    public async validateTokenAsync(): Promise<boolean> {
        let result: boolean = false;

        const parsedTokenData: ParsedTokenData = this._authenticationStateProvider.getParsedTokenData();
        if (new Date(parsedTokenData.accessTokenExpireAt) < new Date()) {
            return false;
        }

        const request: TokenRequest = {
            refreshTokenString: "",
            secondaryKeys: []
        };

        request.refreshTokenString = parsedTokenData.refreshToken;
        request.secondaryKeys = this._additionalData.secondaryKeys;
        const response: BooleanResponse = await this._apiService.postAsync<BooleanResponse>(this.combineUrlWithUri(this._options.baseAddress, this._options.validateTokenUri), request);
        if (response !== null) result = response.result;

        return result;
    }

    public async refreshTokenAsync(): Promise<ParsedTokenData> {
        let parsedTokenData: ParsedTokenData = this._authenticationStateProvider.getParsedTokenData();
        if (new Date(parsedTokenData.accessTokenExpireAt) < new Date()) {
            return null;
        }

        const request: TokenRequest = {
            refreshTokenString: "",
            secondaryKeys: []
        };

        request.refreshTokenString = parsedTokenData.refreshToken;
        request.secondaryKeys = this._additionalData.secondaryKeys;
        parsedTokenData = null;

        try {
            const jwtTokenResponse: JwtTokenResult = await this._apiService.postAsync<JwtTokenResult>(this.combineUrlWithUri(this._options.baseAddress, this._options.refreshUri), request);
            this._authenticationStateProvider.authenticateUserWithAuthenticationResponse(jwtTokenResponse);
            parsedTokenData = this._authenticationStateProvider.getParsedTokenData();
        } catch (e: any) {
            const error: HttpRequestException = e as HttpRequestException;
            if (error !== null) {
                if (error.httpStatusCode === 401) {
                    await this.logoutUserAsync();
                }
                else {
                    throw e;
                }
            }
            else {
                throw e;
            }
        }

        return parsedTokenData;
    }

    public dispose = (): void => {
        this._authenticationStateProvider.authenticationStateChanged.removeEventHandler(this.authenticationStateChangedEventHandler);
    }

    protected combineUrlWithUri(baseAddressUrl: string, uri: string): string {
        const hasPerBA: boolean = baseAddressUrl.endsWith('/');
        const hasPerUri: boolean = uri.startsWith('/');
        let fullUrl: string = "";
        if (hasPerBA && hasPerUri) {
            const _str = uri.substring(1);
            fullUrl = `${baseAddressUrl}${_str}`;
        } else if (!hasPerBA && !hasPerUri) {
            fullUrl = `${baseAddressUrl}/${uri}`;
        } else {
            fullUrl = `${baseAddressUrl}${uri}`;
        }
        return fullUrl;
    }

    private authenticationStateChangedEventHandler = (sender: object, e: AuthenticationStateChangedEventArgs) => {
        if (e.state.user.identity.isAuthenticated) {
            const claimsIdentity: ClaimsIdentity = e.state.user.identity;
            const userId: string = claimsIdentity.findFirst(ClaimTypes.NameIdentifier).value;
            this.onUserAuthenticationStateChanged.raiseEvent(this, new UserDataEventArgs(userId));
        } else {
            this.onUserAuthenticationStateChanged.raiseEvent(this, new UserDataEventArgs(""));
        }
    }

}