import { APPOINTMENT_PAYMENT_SUCCESSFUL } from "../constants/app";
import { eventEmitter } from "../utils";
import sendEmail from "../services/email/sendEmail";
import Payment from "../features/payment/model";
import { User } from "../features/auth/model";

eventEmitter.on(APPOINTMENT_PAYMENT_SUCCESSFUL, async (data) => {
  const { transactionRef, amount, status, metadata } = data;
  const { customerId, hospitalId, appointmentId } = metadata;

  const payment = await Payment.findOne({
    transactionReference: transactionRef,
  });
  const customer = await User.findById(customerId);
  const hospital = await User.findById(hospitalId);

  if (!payment) return;
  if (!customer) return;
  if (!hospital) return;

  payment.status = status;
  await payment.save();

  const hospitalMessage = `Funds came in, ${customer.name} just paid ${amount} to your account`;
  const userMessage = `Payment successful, you sent ${amount} to ${hospital.name}`;

  await sendEmail("Payment Alert", hospitalMessage, hospital.email);
  await sendEmail("Payment Successful", userMessage, customer.email);
});
