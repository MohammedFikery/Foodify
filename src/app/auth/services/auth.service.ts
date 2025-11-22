import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _HttpClient = inject(HttpClient);
  phoneNumber = signal<string>('');
  otp = signal<string>('1234');
  createNewAccount(data: FormData): Observable<any> {
    return this._HttpClient.post(`/api/register`, data);
  }
  Login(data: FormData): Observable<any> {
    return this._HttpClient.post(`/api/login`, data);
  }
  VerifyAccount(data: FormData): Observable<any> {
    return this._HttpClient.post(`/api/verify-otp`, data);
  }
  forgotPassword(data: FormData): Observable<any> {
    return this._HttpClient.post(`/api/forgot-password`, data);
  }
  resetPassword(data: FormData): Observable<any> {
    return this._HttpClient.post(`/api/reset-password`, data);
  }
}
