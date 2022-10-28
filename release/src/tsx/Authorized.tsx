import * as React from "react";
import AuthenticationContext, { AuthnticationContextData } from "./AuthenticationContext";

class Authorized extends React.Component<{ children?: JSX.Element }> {
    static displayName = Authorized.name;

    render() {
        return (
            <AuthenticationContext.Consumer>
                {
                    (authContext: AuthnticationContextData) => <AuthorizedInternal authContext={authContext} {...this.props} />
                }
            </AuthenticationContext.Consumer>
        );
    }

}

export default Authorized;

type AuthorizedInternalProps = {
    children?: JSX.Element;
    authContext: AuthnticationContextData;
}

class AuthorizedInternal extends React.Component<AuthorizedInternalProps> {
    static displayName = AuthorizedInternal.name;

    render() {
        return this.props.authContext.isAuthenticated ? this.props.children : null;
    }

}
