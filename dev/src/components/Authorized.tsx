import * as React from "react";
import AuthenticationContext, { AuthenticationContextData } from "./AuthenticationContext";

class Authorized extends React.Component<{ children?: JSX.Element }> {
    static displayName = Authorized.name;

    render() {
        return (
            <AuthenticationContext.Consumer>
                {
                    (authContext: AuthenticationContextData) => <AuthorizedInternal authContext={authContext} {...this.props} />
                }
            </AuthenticationContext.Consumer>
        );
    }

}

export default Authorized;

type AuthorizedInternalProps = {
    children?: JSX.Element;
    authContext: AuthenticationContextData;
}

class AuthorizedInternal extends React.Component<AuthorizedInternalProps> {
    static displayName = AuthorizedInternal.name;

    render() {
        return this.props.authContext.isAuthenticated ? this.props.children : null;
    }

}
