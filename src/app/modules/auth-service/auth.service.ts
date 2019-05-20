import {
  Injectable,
  Inject
} from '@angular/core';
import {
  Router
} from '@angular/router';
import * as auth0 from 'auth0-js';
import * as crypto from 'crypto-js';
import * as qs from 'qs';
import {
  JwtHelperService
} from '@auth0/angular-jwt';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  ApplicationConfiguration,
  ApplicationConfigurationService
} from '../auth.conf';

/**
 * Essential service for authentication
 * @export
 */

@Injectable()
export class AuthService {
  verifier: string;
  private identityProviderDomain: string;
  private spaOAuthClientId: string;
  private baseUrl: string;

  constructor(@Inject(ApplicationConfigurationService) private applicationConfig: ApplicationConfiguration,
    private router: Router, private httpClient: HttpClient) {
    this.baseUrl = this.constructBaseUrl();
  }

  private constructBaseUrl(): string {
    return document.location.origin;
  }

  getAuthCode(routeSnapshot: string): void {
    this.verifier = this.generateVerifier();
    let codeChallenge: string = this.generateCodeChallenge(this.verifier);
    this.identityProviderDomain = this.applicationConfig.idcsInstance;
    this.spaOAuthClientId = this.applicationConfig.spaOAuthClientId;
    const redirectUrl = this.baseUrl + this.applicationConfig.redirectUrl;
    const scope = this.applicationConfig.oauthTokenScope;

    let auth = new auth0.WebAuth({
      domain: this.identityProviderDomain + this.applicationConfig.basePath,
      clientID: this.spaOAuthClientId,
      redirectUri: redirectUrl,
      scope: scope,
      codeChallenge: codeChallenge,
      codeChallengeMethod: 'S256',
      responseType: 'code',
      state: routeSnapshot
    });
    auth.authorize();
  }

  getAccessToken(authCode: string, state: string): void {
    authCode = decodeURI(authCode);
    this.identityProviderDomain = this.applicationConfig.idcsInstance;
    this.spaOAuthClientId = this.applicationConfig.spaOAuthClientId;

    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    let model = {
      'code': authCode,
      'code_verifier': this.verifier,
      'client_id': this.spaOAuthClientId,
      'grant_type': 'authorization_code'
    };

    let options = {
      headers: httpHeaders,
      observer: 'response'
    };

    this.httpClient.post<Response>('https://' + this.identityProviderDomain + this.applicationConfig.basePath + '/token', qs.stringify(model), options)
      .subscribe(authResult => {
        this.setSession(authResult);
        this.router.navigate(['/' + state]);
      }, error => {
        alert(`Error: ${error.error}. Check the console for further details.`);
      });
  }

  logout(): void {
    if (!this.identityProviderDomain) {
      this.identityProviderDomain = this.applicationConfig.idcsInstance;
      this.redirectToLogout();
    } else {
      this.redirectToLogout();
    }
  }

  private redirectToLogout(): void {
    let postLogoutRedirectUrl = this.baseUrl;
    let logoutUrl: string = 'https://' + this.identityProviderDomain + this.applicationConfig.basePath + '/userlogout?id_token_hint=' + localStorage.getItem('id_token') + '&post_logout_redirect_uri=' + postLogoutRedirectUrl;
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_image_path');
    localStorage.removeItem('id_token');
    localStorage.removeItem('logged_in_user');
    localStorage.removeItem('app_doc_base_url');
    window.open(logoutUrl, '_self');
  }
  getIdentityProviderDomain(): string {
    return this.identityProviderDomain;
  }
  getSpaOAuthClientId(): string {
    return this.spaOAuthClientId;
  }

  private setSession(authResult): void {
    const jwtHelper = new JwtHelperService();
    const accessToken = authResult.access_token;
    const decodedToken = jwtHelper.decodeToken(accessToken);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', authResult.id_token);
    localStorage.setItem('logged_in_user', decodedToken.sub);
  }

  private generateVerifier(): string {
    return this.base64URLEncode(crypto.lib.WordArray.random(43));
  }

  private generateCodeChallenge(verifier: string): string {
    return this.base64URLEncode(this.sha256(verifier));
  }

  private base64URLEncode(crypticString: any): string {
    return crypto.enc.Base64.stringify(crypticString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

  }
  private sha256(verifier: string): string {
    return crypto.SHA256(verifier);
  }
}