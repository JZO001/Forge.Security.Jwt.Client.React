export class TokenizedApiCommunicationServiceOptions {

    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

    mode: RequestMode = "cors";
    cache: RequestCache = "no-cache";
    credentials: RequestCredentials = "same-origin";
    contentType: string = "application/json";
    redirect: RequestRedirect = "follow";
    referrerPolicy: ReferrerPolicy = "no-referrer";

}
