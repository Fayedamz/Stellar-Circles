import { db } from "../../config/database";
import { MemberRole, MemberStatus } from "@stellar-circles/shared";

export interface MembershipRow {
  id: string;
  circle_id: string;
  user_id: string;
  role: MemberRole;
  status: MemberStatus;
  joined_at: Date;
}

export const MembershipModel = {
  find: (circleId: string, userId: string) =>
    db<MembershipRow>("memberships").where({ circle_id: circleId, user_id: userId }).first(),

  findActive: (circleId: string, userId: string) =>
    db<MembershipRow>("memberships")
      .where({ circle_id: circleId, user_id: userId, status: MemberStatus.ACTIVE })
      .first(),

  listByCircle: (circleId: string) =>
    db<MembershipRow>("memberships as m")
      .join("users as u", "u.id", "m.user_id")
      .where({ "m.circle_id": circleId, "m.status": MemberStatus.ACTIVE })
      .select("m.id", "m.role", "m.joined_at", "u.id as userId", "u.username", "u.avatar_url"),

  listByUser: (userId: string) =>
    db<MembershipRow>("memberships as m")
      .join("circles as c", "c.id", "m.circle_id")
      .where({ "m.user_id": userId, "m.status": MemberStatus.ACTIVE })
      .select("m.role", "m.joined_at", "c.id", "c.name", "c.type", "c.status"),

  countAdmins: (circleId: string) =>
    db<MembershipRow>("memberships")
      .where({ circle_id: circleId, role: MemberRole.ADMIN, status: MemberStatus.ACTIVE })
      .count("id as count")
      .first(),

  create: (data: Omit<MembershipRow, "joined_at">) =>
    db<MembershipRow>("memberships").insert({ ...data, joined_at: new Date() }),

  update: (circleId: string, userId: string, data: Partial<MembershipRow>) =>
    db<MembershipRow>("memberships").where({ circle_id: circleId, user_id: userId }).update(data),
};
