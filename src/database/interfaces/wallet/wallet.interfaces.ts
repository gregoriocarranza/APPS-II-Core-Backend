export interface IWallet {
  uuid: string;
  user_uuid: string;
  currency: string;
  balance: number;
  status: WalletStatus;
  last_activity_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export enum WalletStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BLOCKED = "blocked",
}
