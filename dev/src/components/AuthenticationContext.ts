import * as React from "react";

export type AuthenticationContextData = {
    isAuthenticated: boolean;
}

const AuthenticationContext = React.createContext({
    isAuthenticated: false
}) as React.Context<AuthenticationContextData>;

export default AuthenticationContext;
