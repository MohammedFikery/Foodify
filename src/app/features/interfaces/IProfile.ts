export interface IProfile {
  id: number;
  name: string;
  full_name: string;
  phone: string | null;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  birthday: string | null;
  address: string | null;
}
