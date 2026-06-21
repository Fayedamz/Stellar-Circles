import { Schema, model, Document } from "mongoose";

/**
 * Weekly participation snapshot — used for streak calculation and influence decay.
 * One document per (userId, circleId, year, weekNumber).
 */
export interface IParticipationLog extends Document {
  userId: string;
  circleId: string;
  weekNumber: number;  // ISO week number (1–53)
  year: number;
  eventCount: number;
  streakDays: number;  // days active within that week (0–7)
  qualityScore: number; // average peer rating that week (0–5)
  isActive: boolean;    // true if eventCount >= circle's minWeeklyActivities
}

const ParticipationLogSchema = new Schema<IParticipationLog>(
  {
    userId:       { type: String, required: true },
    circleId:     { type: String, required: true },
    weekNumber:   { type: Number, required: true, min: 1, max: 53 },
    year:         { type: Number, required: true },
    eventCount:   { type: Number, default: 0 },
    streakDays:   { type: Number, default: 0, min: 0, max: 7 },
    qualityScore: { type: Number, default: 0, min: 0, max: 5 },
    isActive:     { type: Boolean, default: false },
  },
  { collection: "participation_logs" }
);

// Enforce one doc per user/circle/week
ParticipationLogSchema.index(
  { userId: 1, circleId: 1, year: 1, weekNumber: 1 },
  { unique: true }
);

export const ParticipationLogModel = model<IParticipationLog>(
  "ParticipationLog",
  ParticipationLogSchema
);
