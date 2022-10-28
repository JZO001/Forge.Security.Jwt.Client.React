import { EventArgs } from "jzo-library";
import { AuthenticationState } from "./types";

export class AuthenticationStateChangedEventArgs extends EventArgs {

    private _state: AuthenticationState;

    constructor(state: AuthenticationState) {
        super();
        this._state = state;
    }

    public get state() { return this._state; }

}