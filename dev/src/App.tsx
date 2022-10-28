import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { Guid } from 'jzo-library';

import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import AuthorizeView from './components/AuthorizeView';
import AppRoutes from './components/site/AppRoutes';
import { Layout } from './components/site/Layout';
import { UserContext } from './components/site/UserContext';
import { Configuration } from './security/configuration/Configuration';
import { Options } from './security/options/Options';
import { ServiceStore } from './security/services/ServiceStore';

Options.getJwtClientAuthenticationCoreOptions.baseAddress = "https://localhost:7253/";
Options.getJwtClientAuthenticationCoreOptions.refreshTokenBeforeExpirationInMilliseconds = 50000;
Configuration.addLocalStorage();

// generate a unique device id for this browser
const deviceId_Key = "__deviceId";
if (ServiceStore.storage.containsKey(deviceId_Key)) {
	ServiceStore.additionalData.secondaryKeys.push({ key: deviceId_Key, value: ServiceStore.storage.getAsString(deviceId_Key) });
} else {
	const guid: string = Guid.CreateNewAsString();
	ServiceStore.storage.setAsString(deviceId_Key, guid);
	ServiceStore.additionalData.secondaryKeys.push({ key: deviceId_Key, value: guid });
}

Configuration.configureServices();

UserContext.instance = new UserContext(ServiceStore.authenticationService);

export default class App extends React.Component<{}> {

	render() {
		return (
			<AuthorizeView>
				<Layout>
					<Routes>
						{AppRoutes.map((route, index) => {
							const { element, ...rest } = route;
							return <Route key={index} {...rest} element={element} />;
						})}
					</Routes>
				</Layout>
			</AuthorizeView>
		)
	}

}
