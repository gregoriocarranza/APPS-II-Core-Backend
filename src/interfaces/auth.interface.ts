import { Request } from "express";

export type UserLike = {
  uuid: string;
  email: string;
  name: string;
  role: string;
  subrol: string | null;
  wallet: string[];
  career: {
    uuid: string;
    name: string;
  } | null;
};

export type JwtPayload = {
  sub: string;
  uuid: string;
  email: string;
  name: string;
  role: string;
  subrol: string;
  wallet: string[];
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

export interface ExtendedRequest extends Request {
  user: {
    uuid: string;
    email: string;
    rol: string;
  };
}
