import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories } from '../../features/interfaces/ICategories';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _ToastrService = inject(ToastrService);
  //#region Ajax

  categories(searchValue: string): Observable<ICategories[]> {
    return this._HttpClient.get<ICategories[]>(
      `/api/categories?search=${searchValue}`
    );
  }
  addToCartApi(id: number, data: object): Observable<any> {
    return this._HttpClient.post(`/api/cart/${id}`, data);
  }
  ToggleFavoritesApi(id: number): Observable<any> {
    return this._HttpClient.post(`/api/favorite/${id}`, {});
  }
  myFavorite(): Observable<any> {
    return this._HttpClient.get(`/api/favorites`);
  }
  //#endregion

  //#region function
  addToCart(id: number, data: object) {
    this.addToCartApi(id, data).subscribe({
      next: (res: any) => {
        this._ToastrService.success(res.message);
      },
    });
  }
  ToggleFavorites(id: number) {
    this.ToggleFavoritesApi(id).subscribe({
      next: (res: any) => {
        this._ToastrService.success(res.message);
      },
    });
  }
  //#endregion
}
