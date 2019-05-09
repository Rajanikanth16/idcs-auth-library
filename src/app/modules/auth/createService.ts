import { ApplicationConfiguration } from '../auth.conf';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth-service/auth.service';

export function createAuthService(config: ApplicationConfiguration, router: Router, httpClient: HttpClient) {
  return new AuthService(config, router, httpClient);
}
