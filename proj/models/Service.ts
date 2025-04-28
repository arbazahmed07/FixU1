import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  type: string;
  description: string;
  active: boolean;
  category: string;
  price?: string;
  items: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    active: { type: Boolean, default: true },
    category: { type: String, required: true },
    price: { type: String },
    items: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);