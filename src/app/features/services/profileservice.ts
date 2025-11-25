import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProfile } from '../interfaces/IProfile';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly _http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getProfile(): Observable<IProfile> {
    return this._http.get<IProfile>(`${this.baseUrl}/me`);
  }

  updateProfile(payload: {
    full_name: string;
    email: string;
    birthday: string | null;
    address: string | null;
  }): Observable<{ message: string }> {
    return this._http.post<{ message: string }>(
      `${this.baseUrl}/profile`,
      payload
    );
  }
}
