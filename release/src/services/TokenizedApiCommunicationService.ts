import { ArgumentNullException } from "jzo-library";
import { HttpRequestException } from "../data/HttpRequestException";
import { ITokenizedApiCommunicationService } from "../interfaces/ITokenizedApiCommunicationService";
import { TokenizedApiCommunicationServiceOptions } from "../options/TokenizedApiCommunicationServiceOptions";

export class TokenizedApiCommunicationService implements ITokenizedApiCommunicationService {

    accessToken: string = "";

    private readonly _options: TokenizedApiCommunicationServiceOptions;

    constructor(options: TokenizedApiCommunicationServiceOptions) {
        if (options === null) throw new ArgumentNullException("options");
        this._options = options;
    }

    get options() { return this._options; }

    public async getAsync<TResult>(url: string): Promise<TResult> {
        return await this.apiCallAsync<TResult>("get", url, null);
    }

    public async postAsync<TResult>(url: string, data: any): Promise<TResult> {
        return await this.apiCallAsync<TResult>("post", url, data);
    }

    public async putAsync<TResult>(url: string, data: any): Promise<TResult> {
        return await this.apiCallAsync<TResult>("put", url, data);
    }

    public async deleteAsync<TResult>(url: string): Promise<TResult> {
        return await this.apiCallAsync<TResult>("delete", url, null);
    }

    protected async apiCallAsync<TResult>(httpMethod: string, url: string, data: any): Promise<TResult> {
        const requestInit: RequestInit = {
            method: httpMethod,
            mode: this._options.mode,
            cache: this._options.cache,
            credentials: this._options.credentials,
            headers: {
                'Content-Type': this._options.contentType
            },
            redirect: this._options.redirect,
            referrerPolicy: this._options.referrerPolicy,
        };

        if (this.accessToken !== null && this.accessToken !== "") {
            requestInit.headers = {
                ...requestInit.headers,
                'Authorization': `Bearer ${this.accessToken}`
            };
        }

        if (data !== null) requestInit.body = JSON.stringify(data);

        const response: Response = await fetch(url, requestInit);
        if (response.status !== 200) {
            throw new HttpRequestException(response.status, await response.text());
        }

        return await response.json() as TResult;
    }

}
