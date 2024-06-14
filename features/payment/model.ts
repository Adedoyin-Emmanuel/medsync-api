import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true,
    },
    transactionReference: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true, versionKey: false }
);

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
