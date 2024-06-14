import mongoose from "mongoose";

export interface IMedication extends mongoose.Document {
  hospitalId: string;
  userId: string;
  name: string;
  description: string;
  dosage: string;
  totalPrice: number;
  drugs: string[];
  sideEffects: string[];
}

const MedicationSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    totalPrice: {
      type: Number,
      required: true,
    },

    drugs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Drug",
        required: true,
      },
    ],

    sideEffects: [
      {
        type: String,
        default: "none",
        required: false,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Medication = mongoose.model<IMedication>("Medication", MedicationSchema);

export default Medication;
