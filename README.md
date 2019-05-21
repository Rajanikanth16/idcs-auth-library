# IDCS Auth Library SDK 
[![npm version](https://img.shields.io/npm/v/idcs-auth-library.svg?style=flat-square)](https://www.npmjs.com/package/idcs-auth-library)
[![build status](https://img.shields.io/travis/idcs-auth-library/master.svg?style=flat-square)](https://travis-ci.org/idcs-auth-library)

An Angular wrapper around IDCS **Identity Provider** which supports single sign-on using OpenID standard

This library currently supports three-legged authentication (usually known as most secure) with PKCE (Proof of key code exchange) is used and implemented by both client and authorization server.

This library is tested against the latest version of Angular (currently 6), and is currently known to be compatible with Angular 4, 5, and 6.

`idcs-auth-library` works directly with [`@angular/router`](https://angular.io/guide/router). 

## Getting Started

-   First You need to register your application with IDCS to obtain client id and client secret which can be further used for authentication.
-   You can register an application by following this [link](https://www.oracle.com/webfolder/technetwork/tutorials/obe/cloud/idcs/idcs_authn_api_obe/authn-api.html)

## Installation

This library is available through [npm](https://www.npmjs.com/package/idcs-auth-library). To install it, simply add it to your project:

```bash
# npm
npm install --save idcs-auth-library

```

## Usage

Add [`AuthModule`](#authmodule) to your module's imports.
Then Add [`AuthGuard`](#authguard),[`AuthService`](#authservice),[`ApplicationConfigurationService`] to your module's imports.
Create a configuration object in your local then, import that and provide as [`AUTH_CONFIG`](#auth_config).
Now add [`AuthGuard`](#authguard),[`AuthService`](#authservice),[`ApplicationConfigurationService`] and  [`AUTH_CONFIG`](#auth_config) to the providers.


```typescript
// app.module.ts

import {
  AuthModule,
  AuthGuard, 
  AuthService, 
  ApplicationConfigurationService
} from 'idcs-auth-library';
import { AUTH_CONFIG } from  './auth.constants';

@NgModule({
  imports: [
    ...
    AuthModule.initAuth(AUTH_CONFIG),
    AppRoutingModule
  ],
   providers: [AuthGuard, AuthService,
     {
	    provide:  ApplicationConfigurationService,
		useValue:  AUTH_CONFIG,
     }
  ],
})
export class MyAppModule { }
```

### `AUTH_CONFIG`

```typescript
// auth.constants.ts

export  const  AUTH_CONFIG  = {
basePath:  '',
idcsInstance:  '',
spaOAuthClientId:  '',
oauthTokenScope:  '',
redirectUrl:  '',
};
```
Replace the empty string with your respected values.

An Angular InjectionToken used to configure the AuthService. This value must be provided by your own application. It is initialized by a plain object which can have the following properties:
- `basePath` : this is a prefix for urls used for authcode and access token.
- `idcsInstance` : This is the domain name of the `Identity Provider`.
- `spaOAuthClientId` : ClientId of the app registered in the identityprovider.
- `oauthTokenScope` : is mandatory to get access on all permitted admin APIs.
- `redirectUrl` : URL given while registering application in `Redirect_Url` field.

### `AuthModule`

The top-level Angular module which provides these components and services:

- [`AuthGuard`](#authguard) - A navigation guard using [CanActivate](https://angular.io/api/router/CanActivate) to grant access to a page only after successful authentication.
- [`AuthService`](#authservice) - Highest-level service containing the `idcs-auth-library` public methods.

### `AuthGuard`

Routes are protected by the `AuthGuard`, which verifies there is a valid `accessToken` stored. To ensure the user has been authenticated before accessing your route, add the `canActivate` guard to one of your routes:

```typescript
// app.routing.module.ts

import {
  AuthGuard,
  ...
} from 'idcs-auth-library';

const appRoutes: Routes = [
  {
    path: 'protected',
    component: MyProtectedComponent,
    canActivate: [ AuthGuard ]
  },
  ...
]
```

If a user does not have a valid session, they will be redirected to the IDCS Login Page for authentication. Once authenticated, they will be redirected back to your application's **protected** page.

### `AuthService`

In your components, your can take advantage of all of `idcs-auth-library`'s features by importing the `AuthService`. The example below shows how to  **logout**:

```typescript
// sample.component.ts

import { AuthService } from 'idcs-auth-library';

@Component({
  selector: 'app-component',
  template: `
    <button *ngIf="isAuthenticated" (click)="logout()">Logout</button>

    <router-outlet></router-outlet>
  `,
})
export class MyComponent {
  constructor(public authService: AuthService) {

  logout() {
    this.authService.logout();
  }
}
```

#### `authService.getIdentityProviderDomain()`

Returns domain name of Identity Provider .

#### `authService.getSpaOAuthClientId()`

Returns the ClientId of the app registered in the Identity Provider.

#### `authService.logout()`

Terminates the user's session in IDCS and clears all stored tokens.
