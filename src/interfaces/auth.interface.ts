export type UserLike = {
  id: number | string;
  email: string;
  name?: string;
  role: string;
  career: string;
};

export type JwtPayload = {
  sub: string; // user id
  email: string;
  name?: string;
  role: string;
  career: string;
  jti: string;
};

export type RefreshRecord = {
  jti: string;
  userId: string;
  revoked: boolean;
  expiresAt: number;
  parentJti?: string;
};
