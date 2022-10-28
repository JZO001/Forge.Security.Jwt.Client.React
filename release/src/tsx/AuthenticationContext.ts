import * as React from "react";

export type AuthnticationContextData = {
    isAuthenticated: boolean;
}

const AuthenticationContext = React.createContext({
    isAuthenticated: false
}) as React.Context<AuthnticationContextData>;

export default AuthenticationContext;
