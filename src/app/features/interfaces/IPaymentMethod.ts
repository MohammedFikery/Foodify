export interface IPaymentMethod {
  id: number;
  user_id: number;
  type: string; // ex: 'cart' | 'visa' | 'mastercard' | 'wallet'
  name: string; // ex: 'Visa', 'My Card'
  details: string; // ex: '4444444444444444'
  csv: string | null;
  expire_date: string | null; // ex: '2028-10-10'
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}
