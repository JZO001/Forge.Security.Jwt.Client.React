import { ArgumentNullException } from "jzo-library";
import { AuthenticationStateChangedEventArgs } from "../data/AuthenticationStateChangedEventArgs";
import { ParsedTokenData } from "../data/types";
import { IAuthenticationService } from "../interfaces/IAuthenticationService";
import { JwtClientAuthenticationCoreOptions } from "../options/JwtClientAuthenticationCoreOptions";
import { JwtTokenAuthenticationStateProvider } from "./JwtTokenAuthenticationStateProvider";

export class JwtTokenRefreshService {

    private _authenticationService: IAuthenticationService;
    private _authenticationStateProvider: JwtTokenAuthenticationStateProvider;
    private _options: JwtClientAuthenticationCoreOptions;
    private _parsedTokenData: ParsedTokenData;

    private _timeoutId: number = -1;

    constructor(authenticationService: IAuthenticationService,
        authenticationStateProvider: JwtTokenAuthenticationStateProvider,
        options: JwtClientAuthenticationCoreOptions) {
        if (authenticationService === null) throw new ArgumentNullException("authenticationService");
        if (authenticationStateProvider === null) throw new ArgumentNullException("authenticationStateProvider");
        if (options === null) throw new ArgumentNullException("options");
        this._authenticationService = authenticationService;
        this._authenticationStateProvider = authenticationStateProvider;
        this._options = options;
    }

    public start = (): void => {
        this._authenticationStateProvider.authenticationStateChanged.addEventHandler(this.authenticationStateChangedEventHandler);
        this.configureTimer();
    }

    public stop = (): void => {
        this._authenticationStateProvider.authenticationStateChanged.removeEventHandler(this.authenticationStateChangedEventHandler);
        this.clear();
    }

    private authenticationStateChangedEventHandler = (sender: any, e: AuthenticationStateChangedEventArgs) => {
        this.configureTimer();
    }

    private configureTimer = (): void => {
        this._parsedTokenData = this._authenticationStateProvider.getParsedTokenData();
        const refreshTokenExpiredDate: Date = new Date(this._parsedTokenData.refreshTokenExpireAt);
        if (refreshTokenExpiredDate < new Date()) {
            this.clear();
        } else {
            this.clear();
            let dueTime: number = (refreshTokenExpiredDate.getTime() - Date.now()) - this._options.refreshTokenBeforeExpirationInMilliseconds;
            if (dueTime < 0) dueTime = 0;
            this._timeoutId = setTimeout(this.doWork, dueTime) as unknown as number;
        }
    }

    private clear = (): void => {
        if (this._timeoutId !== -1) {
            clearTimeout(this._timeoutId);
            this._timeoutId = -1;
        }
    }

    private doWork = (): void => {
        this._timeoutId = -1;
        this._authenticationService.refreshTokenAsync()
            .then((parsedTokenData: ParsedTokenData) => {
                if (parsedTokenData.accessToken === null && parsedTokenData.accessToken === "") this.configureTimer();
            })
            .catch(() => {
                setTimeout(() => {
                    this.configureTimer();
                }, 1000);
            });
    }

}