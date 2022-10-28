import * as React from "react";
import AuthenticationContext, { AuthnticationContextData } from "./AuthenticationContext";

class NotAuthorized extends React.Component<{ children?: JSX.Element }> {
    static displayName = NotAuthorized.name;

    render() {
        return (
            <AuthenticationContext.Consumer>
                {
                    (authContext: AuthnticationContextData) => <NotAuthorizedInternal authContext={authContext} {...this.props} />
                }
            </AuthenticationContext.Consumer>
        );
    }

}

export default NotAuthorized;

type NotAuthorizedInternalProps = {
    children?: JSX.Element;
    authContext: AuthnticationContextData;
}

class NotAuthorizedInternal extends React.Component<NotAuthorizedInternalProps> {
    static displayName = NotAuthorizedInternal.name;

    render() {
        return this.props.authContext.isAuthenticated ? null : this.props.children;
    }

}
