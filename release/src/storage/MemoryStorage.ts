import { Dictionary } from "jzo-library";
import { ParsedTokenData } from "../data/types";
import { IStorage } from "../interfaces/IStorage";

export class MemoryStorage implements IStorage {

    private _dictionary: Dictionary<string, string> = new Dictionary<string, string>();

    public containsKey(key: string): boolean {
        return this._dictionary.containsKey(key);
    }

    public getItems(): Array<ParsedTokenData> {
        const result: Array<ParsedTokenData> = [];
        this._dictionary.values.forEach((item: string) => {
            result.push(JSON.parse(item) as ParsedTokenData);
        });
        return result;
    }

    public get(key: string): ParsedTokenData {
        return JSON.parse(this._dictionary.get(key)) as ParsedTokenData;
    }

    public getAsString(key: string): string {
        return sessionStorage.getItem(key);
    }

    public remove(key: string): boolean {
        const result: boolean = this._dictionary.containsKey(key);
        if (result) this._dictionary.remove(key);
        return result;
    }

    public set(key: string, data: ParsedTokenData): void {
        this._dictionary.add(key, JSON.stringify(data));
    }

    public setAsString(key: string, data: string): void {
        sessionStorage.setItem(key, data);
    }

}