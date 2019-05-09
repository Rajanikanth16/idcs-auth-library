import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth-service/auth.guard';
import { AuthService } from '../auth-service/auth.service';
import { ApplicationConfiguration, ApplicationConfigurationService } from '../auth.conf';
import { createAuthService } from './createService';
import { ROUTES } from '../auth.routes';

@NgModule({
  imports: [
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  declarations: [AuthComponent],
  providers: [AuthGuard,
    {
      provide: AuthService,
      useFactory: createAuthService,
      deps: [
        ApplicationConfigurationService,
        Router,
        HttpClient
      ]
    }],
  exports: [AuthComponent]
})
export class AuthModule {
  static initAuth(config: ApplicationConfiguration): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: ApplicationConfigurationService,
          useValue: config
        }
      ]
    };

  }
}
