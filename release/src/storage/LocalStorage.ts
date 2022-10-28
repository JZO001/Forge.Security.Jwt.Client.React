import { ParsedTokenData } from "../data/types";
import { IStorage } from "../interfaces/IStorage";

export class LocalStorage implements IStorage {

    public containsKey(key: string): boolean {
        return localStorage.hasOwnProperty(key);
    }

    public getItems(): Array<ParsedTokenData> {
        const result: Array<ParsedTokenData> = [];
        const keys: Array<string> = Object.keys(localStorage);
        keys.forEach((key: string) => result.push(this.get(key)));
        return result;
    }

    public get(key: string): ParsedTokenData {
        return JSON.parse(localStorage.getItem(key)) as ParsedTokenData;
    }

    public getAsString(key: string): string {
        return localStorage.getItem(key);
    }

    public remove(key: string): boolean {
        const result: boolean = this.containsKey(key);
        if (result) localStorage.removeItem(key);
        return result;
    }

    public set(key: string, data: ParsedTokenData): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    public setAsString(key: string, data: string): void {
        localStorage.setItem(key, data);
    }

}