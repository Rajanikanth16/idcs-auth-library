import { InjectionToken } from '@angular/core';

export interface ApplicationConfiguration {
  basePath: string;
  scope: string;
  idcsInstance: string;
  spaOAuthClientId: string;
  oauthTokenScope: string;
  appDocBaseUrl: string;
}
export const ApplicationConfigurationService = new InjectionToken<ApplicationConfiguration>('ApplicationConfiguration');
