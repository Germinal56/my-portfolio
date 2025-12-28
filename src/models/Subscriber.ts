import { Schema, model, models } from "mongoose";

export interface ISubscriber {
  name: string;
  email: string;
  status: "subscribed" | "unsubscribed";
  createdAt: Date;
  updatedAt: Date;
  source?: string; // e.g., "ebook-landing"
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, lowercase: true, trim: true, index: true, unique: true },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed" },
    source: { type: String, default: "ebook-landing" },
  },
  { timestamps: true }
);

export const Subscriber = models.Subscriber || model<ISubscriber>("Subscriber", SubscriberSchema);