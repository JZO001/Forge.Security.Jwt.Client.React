# Forge.Security.Jwt.Client.Web
Jwt Token authentication / auothorization client side implementation for web apps


## Installing

To install the package run npm package manager:

```
npm install forge-xecurity-jwt-client-web --save
```


## Setup

The first step is to configurate the system. Normally the default values are ok.

### Options
The options are available in class 'Options'.

a, TokenizedApiCommunicationServiceOptions
All settings for the 'fetch' requests.

```
Options.getTokenizedApiCommunicationServiceOptions.mode = 'cors';
Options.getTokenizedApiCommunicationServiceOptions.cache = 'no-cache';
Options.getTokenizedApiCommunicationServiceOptions.credentials = 'same-origin';
Options.getTokenizedApiCommunicationServiceOptions.contentType = 'application/json';
Options.getTokenizedApiCommunicationServiceOptions.redirect = 'follow';
Options.getTokenizedApiCommunicationServiceOptions.referrerPolicy = 'no-referrer';
```

Check this url for details: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch


b, JwtClientAuthenticationCoreOptions
Settings of authentication service (Url and Uri settings), etc

```
// Gets or sets the base address of the request. Leave it empty, if the current domain is used
Options.getJwtClientAuthenticationCoreOptions.baseAddress = "";

// Default URI settings:
Options.getJwtClientAuthenticationCoreOptions.authenticationUri = "api/auth/login";
Options.getJwtClientAuthenticationCoreOptions.logoutUri = "api/auth/logout";
Options.getJwtClientAuthenticationCoreOptions.validateTokenUri = "api/auth/validate-token";
Options.getJwtClientAuthenticationCoreOptions.refreshUri = "api/auth/refresh-token";

// Gets or sets the additional data for token generator. It is better, if the client can provider
// more data, which is unique and help identify the client.
Options.getJwtClientAuthenticationCoreOptions.secondaryKeys = [];

// Client side token refresh service will attempt to renew the accessToken before the expiry time reached
Options.getJwtClientAuthenticationCoreOptions.refreshTokenBeforeExpirationInMilliseconds = 15000;
```

### Services

You will optionally register the client-side storage for the given jwt token, to persist it for next time the browser starts with your web app.

```c#
// Use browser localStorage
Configuration.addLocalStorage();
``` 

Or

```c#
// Use browser localStorage
Configuration.addSessionStorage();
``` 

Or

```c#
// Use memory storage, which does not persist any information
// This is the default, it does not neccessary to invoke it explicit
Configuration.addMemoryStorage();
``` 

Finally, the additional services need to configured:

```c#
Configuration.configureServices();
``` 


Please also check the following projects in my repositories:
- Forge.Yoda
- Forge.Security.Jwt.Service
- Forge.Security.Jwt.Service.Storage.SqlServer
- Forge.Security.Jwt.Client
- Forge.Security.Jwt.Client.Storage.Browser
- Forge.Wasm.BrowserStorages
- Forge.Wasm.BrowserStorages.NewtonSoft.Json
- Forge.Security.Jwt.Client.Web.React

