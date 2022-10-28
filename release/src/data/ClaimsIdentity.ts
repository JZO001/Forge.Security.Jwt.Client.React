import { ArgumentNullException } from "jzo-library";
import { Claim } from "./types";

export class ClaimsIdentity {

    private _claims: Array<Claim>;
    private _authenticationType: string;

    constructor(claims: Array<Claim>, authenticationType: string) {
        if (claims === null) throw new ArgumentNullException("claims");
        this._claims = claims;
        this._authenticationType = authenticationType;
    }

    public get isAuthenticated() { return this._authenticationType !== null && this._authenticationType !== "" }

    public findFirst(type: string): Claim {
        if (type === null) throw new ArgumentNullException("type");

        let result: Claim = null;

        for (let i = 0; i < this._claims.length; i++) {
            const claim: Claim = this._claims[i];
            if (claim.type === type) {
                result = claim;
                break;
            }
        }

        return result;
    }

}