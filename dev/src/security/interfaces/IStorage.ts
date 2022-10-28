import { ParsedTokenData } from "../data/types";

export interface IStorage {

    // Determines whether the specified key exist or not.
    containsKey(key: string): boolean;

    // Gets stored data
    getItems(): Array<ParsedTokenData>;

    // Gets the item by key
    get(key: string): ParsedTokenData;

    // Gets the item by key without JSON.parse
    getAsString(key: string): string;

    // Removes an item from the storage
    remove(key: string): boolean;

    // Sets an item
    set(key: string, data: ParsedTokenData): void;

    // Sets an item as a string (without json stringify)
    setAsString(key: string, data: string): void;

}
