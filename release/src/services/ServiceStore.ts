import { IAuthenticationService } from "../interfaces/IAuthenticationService";
import { IStorage } from "../interfaces/IStorage";
import { IAdditionalData } from "../interfaces/IAdditionalData";
import { ITokenizedApiCommunicationService } from "../interfaces/ITokenizedApiCommunicationService";
import { IJwtTokenRefreshService } from "../interfaces/IJwtTokenRefreshService";
import { IJwtTokenAuthenticationStateProvider } from "../interfaces/IJwtTokenAuthenticationStateProvider";

export class ServiceStore {

    public static additionalData: IAdditionalData = { secondaryKeys: [] };

    public static tokenizedApiCommunicationService: ITokenizedApiCommunicationService = null;

    public static storage: IStorage = null;

    public static authenticationService: IAuthenticationService = null;

    public static jwtTokenAuthenticationStateProvider: IJwtTokenAuthenticationStateProvider = null;

    public static jwtTokenRefreshService: IJwtTokenRefreshService = null;

}