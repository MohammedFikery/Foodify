import { Injectable } from '@angular/core';
import { IPaymentMethod } from '../interfaces/IPaymentMethod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private _Http: HttpClient) {}
  getPaymentMethods(): Observable<any> {
    return this._Http.get(`/api/payment-methods`);
  }

  addPaymentMethod(payload: {
    type: string;
    name: string;
    details: string;
    csv?: string;
    expire_date?: string;
    is_default: boolean;
  }) {
    const formData = new FormData();
    formData.append('type', payload.type);
    formData.append('name', payload.name);
    formData.append('details', payload.details);
    formData.append('is_default', payload.is_default ? '1' : '0');

    if (payload.csv) formData.append('csv', payload.csv);
    if (payload.expire_date)
      formData.append('expire_date', payload.expire_date);

    return this._Http.post<{ data: IPaymentMethod }>(
      `/api/payment-methods`,
      formData
    );
  }

  setDefaultPaymentMethod(id: number) {
    return this._Http.post(`/api/payment-methods/${id}/set-default`, {});
  }

  deletePaymentMethod(id: number) {
    return this._Http.delete(`/api/payment-methods/${id}`);
  }
}
