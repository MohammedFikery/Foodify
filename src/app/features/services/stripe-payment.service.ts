import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStripePaymentIntent } from '../interfaces/IStripePaymentIntent';

@Injectable({ providedIn: 'root' })
export class StripePaymentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/payments';

  createPaymentIntent(total: number): Observable<IStripePaymentIntent> {
    return this.http.post<IStripePaymentIntent>(
      `${this.baseUrl}/create-intent`,
      {
        amount: total,
      }
    );
  }
}
