export interface ITransfer {
  uuid: string;
  from_wallet_uuid: string | null;
  to_wallet_uuid: string | null;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description?: string | null;
  metadata?: Record<string, any> | null;
  processed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
