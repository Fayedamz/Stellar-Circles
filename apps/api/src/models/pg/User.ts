/**
 * PostgreSQL User model helpers using Knex query builder.
 */
import { db } from "../../config/database";

export interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  stellar_address: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export const UserModel = {
  findById: (id: string) =>
    db<UserRow>("users").where({ id }).first(),

  findByEmail: (email: string) =>
    db<UserRow>("users").where({ email }).first(),

  findByUsername: (username: string) =>
    db<UserRow>("users").where({ username }).first(),

  findByStellarAddress: (stellarAddress: string) =>
    db<UserRow>("users").where({ stellar_address: stellarAddress }).first(),

  create: (data: Omit<UserRow, "created_at" | "updated_at">) =>
    db<UserRow>("users").insert({ ...data, created_at: new Date(), updated_at: new Date() }),

  update: (id: string, data: Partial<UserRow>) =>
    db<UserRow>("users").where({ id }).update({ ...data, updated_at: new Date() }),

  publicProfile: (id: string) =>
    db<UserRow>("users")
      .where({ id })
      .select("id", "username", "avatar_url", "bio", "stellar_address", "created_at")
      .first(),
};
