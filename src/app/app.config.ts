import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { provideToastr } from 'ngx-toastr';
import { globalInterceptor } from './core/interceptor/global.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';

// Add this import 👇
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions()
    ),

    provideClientHydration(),

    provideHttpClient(
      withFetch(),
      withInterceptors([globalInterceptor, errorInterceptor])
    ),
    provideToastr(),
    provideAnimations(),
  ],
};
