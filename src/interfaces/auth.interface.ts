export type UserLike = {
  uuid: string;
  email: string;
  name: string;
  role: string;
  career: {
    uuid: string;
    name: string;
  } | null;
};

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
  career: {
    uuid: string;
    name: string;
  } | null;
  jti: string;
};

export type RefreshRecord = {
  jti: string;
  userId: string;
  revoked: boolean;
  expiresAt: number;
  parentJti?: string;
};
