import { JwtClientAuthenticationCoreOptions } from "./JwtClientAuthenticationCoreOptions";
import { TokenizedApiCommunicationServiceOptions } from "./TokenizedApiCommunicationServiceOptions";

export class Options {

    private static _jwtClientAuthenticationCoreOptions: JwtClientAuthenticationCoreOptions = new JwtClientAuthenticationCoreOptions();
    private static _tokenizedApiCommunicationServiceOptions: TokenizedApiCommunicationServiceOptions = new TokenizedApiCommunicationServiceOptions();

    public static get getJwtClientAuthenticationCoreOptions(): JwtClientAuthenticationCoreOptions { return Options._jwtClientAuthenticationCoreOptions; }
    public static get getTokenizedApiCommunicationServiceOptions(): TokenizedApiCommunicationServiceOptions { return Options._tokenizedApiCommunicationServiceOptions }

}
