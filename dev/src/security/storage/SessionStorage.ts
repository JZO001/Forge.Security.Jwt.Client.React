import { ParsedTokenData } from "../data/types";
import { ISessionStorage } from "../interfaces/ISessionStorage";

export class SessionStorage implements ISessionStorage {

    public containsKey(key: string): boolean {
        return sessionStorage.hasOwnProperty(key);
    }

    public getItems(): Array<ParsedTokenData> {
        const result: Array<ParsedTokenData> = [];
        const keys: Array<string> = Object.keys(sessionStorage);
        keys.forEach((key: string) => result.push(this.get(key)));
        return result;
    }

    public get(key: string): ParsedTokenData {
        return JSON.parse(sessionStorage.getItem(key)) as ParsedTokenData;
    }

    public getAsString(key: string): string {
        return sessionStorage.getItem(key);
    }

    public remove(key: string): boolean {
        const result: boolean = this.containsKey(key);
        if (result) sessionStorage.removeItem(key);
        return result;
    }

    public set(key: string, data: ParsedTokenData): void {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    public setAsString(key: string, data: string): void {
        sessionStorage.setItem(key, data);
    }

}