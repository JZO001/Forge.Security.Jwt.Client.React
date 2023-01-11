import { TokenizedApiCommunicationServiceOptions } from "../options/TokenizedApiCommunicationServiceOptions";

export interface ITokenizedApiCommunicationService {

    accessToken: string;

    get options(): TokenizedApiCommunicationServiceOptions;

    getAsync<TResult>(url: string): Promise<TResult>;

    postAsync<TResult>(url: string, data: any): Promise<TResult>;

    putAsync<TResult>(url: string, data: any): Promise<TResult>;

    deleteAsync<TResult>(url: string): Promise<TResult>;

}
