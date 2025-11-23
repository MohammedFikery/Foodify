import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environment/environment';

export const globalInterceptor: HttpInterceptorFn = (req, next) => {
  const id = inject(PLATFORM_ID);
  const spinner = inject(NgxSpinnerService);
  let userToken = '';

  if (isPlatformBrowser(id)) {
    userToken = localStorage.getItem('userToken') || '';
    console.log('Current Token in Storage:', localStorage.getItem('userToken'));
  }
  spinner.show();
  const myReq = req.clone({
    url: environment.ServerUrl + req.url,
    setHeaders: {
      Authorization: userToken ? `Bearer ${userToken}` : '',
    },
  });

  return next(myReq).pipe(finalize(() => spinner.hide()));
};
