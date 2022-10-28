import { Exception } from "jzo-library";

export class SecurityTokenException extends Exception {

    static Cast = (obj: any): SecurityTokenException => obj as SecurityTokenException;
    static CastArray = (obj: any): Array<SecurityTokenException> => obj as Array<SecurityTokenException>;

}
