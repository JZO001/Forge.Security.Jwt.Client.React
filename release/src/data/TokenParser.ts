import { ClaimTypes } from "./ClaimTypes";
import { Claim } from "./types";

export class TokenParser {

    public static Parse = (jwtAccessToken: string): Array<Claim> => {
        const result: Array<Claim> = [];
        if (jwtAccessToken != null && jwtAccessToken.length > 0) {
            const payload = jwtAccessToken.split('.')[1];
            const jsonBytes = TokenParser.ParseBase64WithoutPadding(payload);
            const keyValuePairs = JSON.parse(jsonBytes);

            const roles = TokenParser.TryGetRole(keyValuePairs);
            if (roles !== null) {
                if (roles.toString().trim().startsWith("[")) {
                    const parsedRoles: Array<string> = JSON.parse(roles.toString());
                    parsedRoles.forEach((str) => result.push({ type: ClaimTypes.Role, value: str }));
                } else {
                    result.push({ type: ClaimTypes.Role, value: roles });
                }

                for (let key in keyValuePairs) {
                    if (key === ClaimTypes.Role) {
                        delete keyValuePairs[key];
                        break;
                    }
                }
            }

            for (let key in keyValuePairs) {
                result.push({ type: key, value: keyValuePairs[key] });
            }

        }
        return result;
    }

    private static TryGetRole = (keyValuePairs: any): string => {
        let result = null as unknown as string;
        for (let key in keyValuePairs) {
            if (key === ClaimTypes.Role) {
                result = keyValuePairs[key];
                break;
            }
        }
        return result;
    }

    private static ParseBase64WithoutPadding = (base64: string) => {
        switch (base64.length % 4) {
            case 2: base64 += "=="; break;
            case 3: base64 += "="; break;
        }
        return atob(base64);
    }

}
