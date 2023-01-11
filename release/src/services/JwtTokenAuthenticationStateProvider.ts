import { ArgumentNullException, GenericEvent } from "jzo-library";
import { AuthenticationStateChangedEventArgs } from "../data/AuthenticationStateChangedEventArgs";
import { ClaimsIdentity } from "../data/ClaimsIdentity";
import { ClaimTypes } from "../data/ClaimTypes";
import { SecurityTokenException } from "../data/SecurityTokenException";
import { TokenParser } from "../data/TokenParser";
import { AuthenticationResponse, AuthenticationState, Claim, ClaimsPrincipal, ParsedTokenData } from "../data/types";
import { IJwtTokenAuthenticationStateProvider } from "../interfaces/IJwtTokenAuthenticationStateProvider";
import { IJwtTokenRefreshService } from "../interfaces/IJwtTokenRefreshService";
import { IStorage } from "../interfaces/IStorage";
import { ITokenizedApiCommunicationService } from "../interfaces/ITokenizedApiCommunicationService";
import { ServiceStore } from "./ServiceStore";

export class JwtTokenAuthenticationStateProvider implements IJwtTokenAuthenticationStateProvider {

    private static _refreshService: IJwtTokenRefreshService = null;

    private readonly _storageService: IStorage;
    private readonly _apiService: ITokenizedApiCommunicationService;
    private _firstPassSignal: boolean = true;

    public readonly PARSED_TOKEN_STORAGE_KEY: string = "__parsedToken";

    public readonly authenticationStateChanged: GenericEvent<AuthenticationStateChangedEventArgs> = new GenericEvent<AuthenticationStateChangedEventArgs>();

    constructor(storage: IStorage,
        apiService: ITokenizedApiCommunicationService) {
        if (storage === null) throw new ArgumentNullException("storage");
        if (apiService === null) throw new ArgumentNullException("apiService");
        this._storageService = storage;
        this._apiService = apiService;
    }

    public getAuthenticationState(): AuthenticationState {
        if (JwtTokenAuthenticationStateProvider._refreshService === null) {
            JwtTokenAuthenticationStateProvider._refreshService = ServiceStore.jwtTokenRefreshService;
            JwtTokenAuthenticationStateProvider._refreshService.start();
        }

        const parsedTokenData: ParsedTokenData = this.getParsedTokenData();

        if (this._firstPassSignal) {
            this._firstPassSignal = false;
            try {
                this.authenticateUserWithParsedTokenData(parsedTokenData);
            }
            catch (e) {
                this.logout();
                return {
                    user: {
                        identity: new ClaimsIdentity([], "")
                    }
                };
            }
        }

        return {
            user: {
                identity: new ClaimsIdentity(parsedTokenData.claims, "jwt")
            }
        };
    }

    public authenticateUserWithAuthenticationResponse(authenticationResponse: AuthenticationResponse): void {
        if (authenticationResponse === null) throw new ArgumentNullException("authenticationResponse");
        const parsedTokenData: ParsedTokenData = this.parseToken(authenticationResponse);
        this.authenticateUserInner(parsedTokenData);
    }

    public authenticateUserWithParsedTokenData(parsedTokenData: ParsedTokenData): void {
        if (parsedTokenData === null) throw new ArgumentNullException("parsedTokenData");
        this.authenticateUserInner(parsedTokenData);
    }

    public logout(): void {
        const anonymusUser: ClaimsPrincipal = {
            identity: new ClaimsIdentity([], "")
        };

        const authenticationState: AuthenticationState = {
            user: anonymusUser
        };

        this._storageService.remove(this.PARSED_TOKEN_STORAGE_KEY);

        this._apiService.accessToken = "";
        this.authenticationStateChanged.raiseEvent(this, new AuthenticationStateChangedEventArgs(authenticationState));
    }

    protected authenticateUserInner(parsedTokenData: ParsedTokenData) {
        const idClaim: Claim = parsedTokenData.claims.find(item => item.type === ClaimTypes.NameIdentifier);
        const userId: string = idClaim === undefined ? null : idClaim.value;
        if (userId === null || userId === "") throw new SecurityTokenException("Invalid token");

        this._storageService.set(this.PARSED_TOKEN_STORAGE_KEY, parsedTokenData);

        this._apiService.accessToken = parsedTokenData.accessToken;

        const authenticatedUser: ClaimsPrincipal = {
            identity: new ClaimsIdentity([{ type: ClaimTypes.NameIdentifier, value: userId }], "apiauth")
        };

        const authenticationState: AuthenticationState = {
            user: authenticatedUser
        };

        this.authenticationStateChanged.raiseEvent(this, new AuthenticationStateChangedEventArgs(authenticationState));
    }

    public getParsedTokenData(): ParsedTokenData {
        let result: ParsedTokenData = null;

        try {
            result = this._storageService.get(this.PARSED_TOKEN_STORAGE_KEY);
        } catch (e: any) {
            //console.log(e);
        }

        if (result === null || this.isTokenExpired(new Date(result.accessTokenExpireAt))) {
            result = {
                accessToken: "",
                accessTokenExpireAt: new Date(1970, 1, 1, 1, 0, 0, 0).toUTCString(),
                refreshToken: "",
                refreshTokenExpireAt: new Date(1970, 1, 1, 1, 0, 0, 0).toUTCString(),
                claims: []
            };
        } else {
            result.claims = [];
            result.claims = TokenParser.Parse(result.accessToken);
        }

        return result;
    }

    public parseToken(loginResponse: AuthenticationResponse): ParsedTokenData {
        const result: ParsedTokenData = {
            accessToken: "",
            accessTokenExpireAt: new Date(1970, 1, 1, 1, 0, 0, 0).toUTCString(),
            refreshToken: "",
            refreshTokenExpireAt: new Date(1970, 1, 1, 1, 0, 0, 0).toUTCString(),
            claims: []
        };

        if (loginResponse.accessToken === null || loginResponse.accessToken === "") {
            return result;
        }

        const claims: Array<Claim> = TokenParser.Parse(loginResponse.accessToken);
        const accessTokenExpireDateNum: number = parseInt(claims.find(item => item.type === "exp").value) * 1000; // need miliseconds here
        const accessTokenExpiredDate: Date = new Date(accessTokenExpireDateNum);

        if (this.isTokenExpired(accessTokenExpiredDate)) {
            this.logout();
            return result;
        }

        result.claims = claims;
        result.accessTokenExpireAt = accessTokenExpiredDate.toUTCString();
        result.accessToken = loginResponse.accessToken;
        result.refreshTokenExpireAt = loginResponse.refreshTokenExpireAt;
        result.refreshToken = loginResponse.refreshToken;

        return result;
    }

    protected isTokenExpired(expireDate: Date) {
        return expireDate < new Date();
    }

}