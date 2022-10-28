import { TokenizedApiCommunicationService } from "../services/TokenizedApiCommunicationService";
import { Options } from "../options/Options";
import { ServiceStore } from "../services/ServiceStore";
import { LocalStorage } from "../storage/LocalStorage";
import { MemoryStorage } from "../storage/MemoryStorage";
import { SessionStorage } from "../storage/SessionStorage";
import { JwtTokenAuthenticationStateProvider } from "../services/JwtTokenAuthenticationStateProvider";
import { JwtTokenRefreshService } from "../services/JwtTokenRefreshService";
import { AuthenticationService } from "../services/AuthenticationService";

export class Configuration {

    public static addLocalStorage(): void {
        ServiceStore.storage = new LocalStorage();
    }

    public static addSessionStorage(): void {
        ServiceStore.storage = new SessionStorage();
    }

    public static addMemoryStorage(): void {
        ServiceStore.storage = new MemoryStorage();
    }

    public static configureServices(): void {
        // configure network API
        ServiceStore.tokenizedApiCommunicationService = new TokenizedApiCommunicationService(Options.getTokenizedApiCommunicationServiceOptions);

        // if no storage set, MemoryStorage is the default
        if (ServiceStore.storage === null) {
            Configuration.addMemoryStorage();
        }

        ServiceStore.jwtTokenAuthenticationStateProvider = new JwtTokenAuthenticationStateProvider(ServiceStore.storage, ServiceStore.tokenizedApiCommunicationService);

        ServiceStore.authenticationService = new AuthenticationService(ServiceStore.tokenizedApiCommunicationService, ServiceStore.jwtTokenAuthenticationStateProvider, ServiceStore.additionalData, Options.getJwtClientAuthenticationCoreOptions);

        ServiceStore.jwtTokenRefreshService = new JwtTokenRefreshService(ServiceStore.authenticationService, ServiceStore.jwtTokenAuthenticationStateProvider, Options.getJwtClientAuthenticationCoreOptions);
    }

}