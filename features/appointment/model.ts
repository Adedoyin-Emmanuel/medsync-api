import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      max: 50,
    },
    description: {
      type: String,
      required: true,
      max: 1000,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      required: false,
      default: "pending",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
    reviews: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: false },
    ],
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
