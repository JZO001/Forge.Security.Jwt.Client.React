import { EventArgs } from "jzo-library";

export class UserDataEventArgs extends EventArgs {

    private _userId: string;

    constructor(userId: string) {
        super();
        this._userId = userId;
    }

    public get userId() { return this._userId; }

}