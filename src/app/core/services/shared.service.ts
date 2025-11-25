import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories } from '../../features/interfaces/ICategories';
import { MyCart } from '../../features/interfaces/ICart';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private readonly _HttpClient = inject(HttpClient);
  private readonly _ToastrService = inject(ToastrService);
  total_items = signal<number>(0);
  //#region Ajax

  categories(searchValue: string): Observable<ICategories[]> {
    return this._HttpClient.get<ICategories[]>(
      `/api/categories?search=${searchValue}`
    );
  }
  addToCartApi(id: number, data: object): Observable<any> {
    return this._HttpClient.post(`/api/cart/${id}`, data);
  }
  removeCartApi(id: number): Observable<any> {
    return this._HttpClient.delete(`/api/cart/${id}`);
  }
  ToggleFavoritesApi(id: number): Observable<any> {
    return this._HttpClient.post(`/api/favorite/${id}`, {});
  }
  myFavorite(): Observable<any> {
    return this._HttpClient.get(`/api/favorites`);
  }
  dashes(Catid: string | null, searchValue: string): Observable<any> {
    return this._HttpClient.get(
      `/api/categories/${Catid}/dishes?search=${searchValue}`
    );
  }
  myCart(): Observable<MyCart> {
    return this._HttpClient.get<MyCart>(`/api/cart`);
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
  RemoveFromCart(id: number): Observable<any> {
    return this.removeCartApi(id);
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
