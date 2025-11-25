export interface MyCart {
  data: ICart[];
  summary: Summary;
}

export interface Summary {
  total_items: number;
  total_price: number;
}

export interface ICart {
  id: number;
  name: string;
  price: string;
  kcal: number;
  image: string;
  quantity: number;
  subtotal: number;
}
