import { InjectionToken } from '@angular/core';

export interface ApplicationConfiguration {
  basePath: string;
  idcsInstance: string;
  spaOAuthClientId: string;
  oauthTokenScope: string;
  redirectUrl: string;
}
export const ApplicationConfigurationService = new InjectionToken<ApplicationConfiguration>('ApplicationConfiguration');
