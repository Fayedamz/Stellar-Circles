import { db } from "../../config/database";
import { CircleType, CircleStatus, MembershipType } from "@stellar-circles/shared";

export interface CircleRow {
  id: string;
  name: string;
  description: string;
  type: CircleType;
  status: CircleStatus;
  membership_type: MembershipType;
  rules: string; // JSON string
  creator_id: string;
  member_count: number;
  created_at: Date;
  updated_at: Date;
}

export const CircleModel = {
  findById: (id: string) =>
    db<CircleRow>("circles").where({ id }).first(),

  findByCreator: (creatorId: string) =>
    db<CircleRow>("circles").where({ creator_id: creatorId }).orderBy("created_at", "desc"),

  listActive: (type?: CircleType, search?: string, limit = 20, offset = 0) => {
    let q = db<CircleRow>("circles").where({ status: CircleStatus.ACTIVE });
    if (type) q = q.where({ type });
    if (search) q = q.whereILike("name", `%${search}%`);
    return q.limit(limit).offset(offset).orderBy("member_count", "desc");
  },

  incrementMemberCount: (id: string, delta: 1 | -1) =>
    db("circles").where({ id }).increment("member_count", delta),

  update: (id: string, data: Partial<CircleRow>) =>
    db<CircleRow>("circles").where({ id }).update({ ...data, updated_at: new Date() }),
};
