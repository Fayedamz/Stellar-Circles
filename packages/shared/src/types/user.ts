export enum MemberRole {
  ADMIN  = "ADMIN",
  MEMBER = "MEMBER",
}

export enum MemberStatus {
  ACTIVE   = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED   = "BANNED",
}

export interface User {
  id: string;
  username: string;
  email: string;
  /** Optional Stellar account address for blockchain anchoring */
  stellarAddress?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  circleId: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  user?: Pick<User, "id" | "username" | "avatarUrl">;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  stellarAddress?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, "createdAt">;
}
