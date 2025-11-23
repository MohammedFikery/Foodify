import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Irecommended } from '../interfaces/Irecommended';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly _HttpClient = inject(HttpClient);
  recommended(): Observable<Irecommended[]> {
    return this._HttpClient.get<Irecommended[]>(`/api/recommended`);
  }
}
