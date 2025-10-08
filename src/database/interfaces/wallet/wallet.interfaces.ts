export interface IWallet {
  uuid: string;
  user_id: number;
  currency: string;
  status: string;
  created_at?: string;
}
