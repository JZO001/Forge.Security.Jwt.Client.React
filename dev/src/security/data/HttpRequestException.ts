import { Exception } from "jzo-library";

export class HttpRequestException extends Exception {

    static Cast = (obj: any): HttpRequestException => obj as HttpRequestException;
    static CastArray = (obj: any): Array<HttpRequestException> => obj as Array<HttpRequestException>;

    private readonly _httpStatusCode: number;
    private readonly _responseContent: string;

    constructor(httpStatusCode: number, responseContent: string, message?: string, innerException?: Exception) {
        super(message, innerException);
        this._httpStatusCode = httpStatusCode;
        this._responseContent = responseContent;
    }

    public get httpStatusCode() { return this._httpStatusCode; }

    public get responseContent() { return this._responseContent; }

}
