import { TokenizedApiCommunicationService } from "./TokenizedApiCommunicationService";
import { IAuthenticationService } from "../interfaces/IAuthenticationService";
import { IStorage } from "../interfaces/IStorage";
import { JwtTokenAuthenticationStateProvider } from "./JwtTokenAuthenticationStateProvider";
import { JwtTokenRefreshService } from "./JwtTokenRefreshService";
import { IAdditionalData } from "../interfaces/IAdditionalData";

export class ServiceStore {

    public static additionalData: IAdditionalData = { secondaryKeys: [] };

    public static tokenizedApiCommunicationService: TokenizedApiCommunicationService = null;

    public static storage: IStorage = null;

    public static authenticationService: IAuthenticationService = null;

    public static jwtTokenAuthenticationStateProvider: JwtTokenAuthenticationStateProvider = null;

    public static jwtTokenRefreshService: JwtTokenRefreshService = null;

}