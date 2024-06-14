import mongoose from "mongoose";

export interface IDrug extends mongoose.Document {
  hospitalId: string;
  name: string;
  description: string;
  dosage: string;
  price: number;
  status: "active" | "inactive";
  imageUrl: string;
}

const DrugSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },

    name: {
      type: String,
      required: true,
      max: 250,
    },

    description: {
      type: String,
      required: true,
      max: 2500,
    },

    dosage: {
      type: String,
      required: true,
      max: 2500,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Drug = mongoose.model<IDrug>("Drug", DrugSchema);

export default Drug;
