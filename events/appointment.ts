import { eventEmitter } from "../utils";
import { APPOINTMENT_CREATED, APPOINTMENT_UPDATED } from "../constants/app";
import sendEmail from "../services/email/sendEmail";

eventEmitter.on(APPOINTMENT_CREATED, (data) => {
  const { userDetails, hospitalName, hospitalEmail, appointment } = data;
  const { name, username, id } = userDetails;
  const {
    title,
    description,
    startDate,
    endDate,
    _id: appointmentId,
  } = appointment;

  const message = `
          <p>Dear <strong>${hospitalName}</strong>,</p>
          <p>We are pleased to inform you that a new appointment has been created by ${name}. Below are the details of the appointment:</p>
          <br/>
           <ul>
                <li><strong>Title:</strong> ${title}</li>
                <li><strong>Description:</strong> ${description}</li>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Username:</strong> ${username}</li>
                <li><strong>Email:</strong> ${hospitalEmail}</li>
                <li><strong>Start Date:</strong> ${startDate}</li>
                <li><strong>End Date:</strong> ${endDate}</li>
            </ul>

             <p>Please log in to your dashboard to view more details and manage the appointment.</p>
             <a href="http://localhost:3000/hospital/appointments/${appointmentId}" class="button">Go to dashboard</a>
    `;

  sendEmail("Appointment Alert", message, hospitalEmail);
});

eventEmitter.on(APPOINTMENT_UPDATED, (data) => {
  const { userDetails, hospitalName, appointment } = data;
  const { name, username, email, id } = userDetails;
  const {
    title,
    description,
    startDate,
    endDate,
    _id: appointmentId,
  } = appointment;

  const message = `
          <p>Dear <strong>${hospitalName}</strong>,</p>
          <p>Your appointment with ${name} has been update. Below are the details of the appointment:</p>
          <br/>
           <ul>
                <li><strong>Title:</strong> ${title}</li>
                <li><strong>Description:</strong> ${description}</li>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Username:</strong> ${username}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Start Date:</strong> ${startDate}</li>
                <li><strong>End Date:</strong> ${endDate}</li>
            </ul>

             <p>Please log in to your dashboard to view more details and manage the appointment.</p>
             <a href="http://localhost:3000/hospital/appointments/${appointmentId}" class="button">Go to dashboard</a>
    `;

  sendEmail("Appointment Update", message, email);
});
