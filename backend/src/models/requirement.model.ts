import mongoose, { Schema, Document } from 'mongoose';
import { RequirementInput } from '../types/requirement.types.js';

export interface IRequirementDocument extends RequirementInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const RequirementSchema = new Schema<IRequirementDocument>(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['Wedding', 'Corporate Event', 'Concert', 'Festival', 'Private Party', 'Other'],
    },
    eventTypeOther: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    date: {
      startDate: {
        type: String,
        required: true,
      },
      endDate: {
        type: String,
        default: null,
      },
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    venue: {
      type: String,
      trim: true,
      maxlength: 150,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['planner', 'performer', 'crew'],
      index: true,
    },
    categoryDetails: {
      type: Schema.Types.Mixed,
      required: true,
    },
    additionalDetails: {
      preferredTimeWindow: { type: String, default: '' },
      venueType: { type: String, enum: ['indoor', 'outdoor', 'hybrid', null], default: null },
      equipmentFacilities: { type: String, default: '' },
      additionalNotes: { type: String, default: '' },
      contactName: { type: String, required: true, trim: true },
      contactEmail: { type: String, required: true, trim: true, lowercase: true },
      contactPhone: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

RequirementSchema.index({ category: 1, createdAt: -1 });
RequirementSchema.index({ createdAt: -1 });

export const Requirement = mongoose.model<IRequirementDocument>('Requirement', RequirementSchema);
