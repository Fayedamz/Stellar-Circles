import { db } from "../../config/database";
import { DecisionStatus } from "@stellar-circles/shared";

export interface DecisionRow {
  id: string;
  circle_id: string;
  creator_id: string;
  title: string;
  description: string;
  status: DecisionStatus;
  result: string | null; // JSON
  closes_at: Date;
  created_at: Date;
  updated_at: Date;
}

export const DecisionModel = {
  findById: (id: string) =>
    db<DecisionRow>("decisions").where({ id }).first(),

  listByCircle: (circleId: string, status?: DecisionStatus) => {
    let q = db<DecisionRow>("decisions").where({ circle_id: circleId });
    if (status) q = q.where({ status });
    return q.orderBy("created_at", "desc");
  },

  /** Find open decisions whose voting period has expired — for the close cron job */
  findExpiredOpen: () =>
    db<DecisionRow>("decisions")
      .where({ status: DecisionStatus.OPEN })
      .where("closes_at", "<", new Date()),

  create: (data: Omit<DecisionRow, "created_at" | "updated_at" | "result">) =>
    db<DecisionRow>("decisions").insert({
      ...data,
      result: null,
      created_at: new Date(),
      updated_at: new Date(),
    }),

  close: (id: string, result: object) =>
    db<DecisionRow>("decisions").where({ id }).update({
      status: DecisionStatus.CLOSED,
      result: JSON.stringify(result),
      updated_at: new Date(),
    }),
};
