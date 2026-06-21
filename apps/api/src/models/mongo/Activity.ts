import { Schema, model, Document } from "mongoose";
import { ActivityType } from "@stellar-circles/shared";

export interface IActivity extends Document {
  userId: string;
  circleId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  /** Stellar tx hash — present if this activity was anchored on Stellar */
  stellarTxHash?: string;
  influenceDelta: number;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId:      { type: String, required: true, index: true },
    circleId:    { type: String, required: true, index: true },
    type:        { type: String, required: true, enum: Object.values(ActivityType) },
    description: { type: String, required: true, maxlength: 500 },
    metadata:    { type: Schema.Types.Mixed },
    stellarTxHash: { type: String, sparse: true },
    influenceDelta:{ type: Number, default: 0 },
    timestamp:   { type: Date, default: Date.now, index: true },
  },
  {
    collection: "activities",
    timestamps: false, // Using explicit timestamp field
  }
);

// Compound index for fetching a user's activities in a circle sorted by time
ActivitySchema.index({ circleId: 1, userId: 1, timestamp: -1 });
// Index for circle-wide activity feed
ActivitySchema.index({ circleId: 1, timestamp: -1 });

export const ActivityModel = model<IActivity>("Activity", ActivitySchema);
