const express = require("express");
const { getAllDoctors, createNewDoctor, loginDoctor, logout, deleteDoctor, getDoctorDetails, updateDoctorProfile } = require("../controller/doctorController");
const { updateappointment, getDoctorPendingAppointments, getDoctorCompletedAppointments, getAppointmentDetailsDoctor } = require("../controller/appointmentController");
const { isAuthenticatedDoctor } = require("../middleware/auth");
const { getUserDetailsForDoctor } = require("../controller/userController");

const Router = express.Router();

Router.route("/doctors").get(getAllDoctors); // Admin

// Login Logout and register
Router.route("/doctor/new").post(createNewDoctor);
Router.route("/doctor/login").post(loginDoctor);
Router.route("/doctor/logout").put(logout);

// Appointments Routes

// Upcomming appointments
Router.route("/doctor/appointments").get(isAuthenticatedDoctor,getDoctorPendingAppointments);

// Completed appointments or Previous record
Router.route("/doctor/oldAppointments").get(isAuthenticatedDoctor,getDoctorCompletedAppointments);

// Get and update details of appointment
Router.route("/doctor/appointment/:id").get(isAuthenticatedDoctor,getAppointmentDetailsDoctor).put(isAuthenticatedDoctor,updateappointment);

// doctor fetch user profile
Router.route("/doctor/user/:id").get(isAuthenticatedDoctor,getUserDetailsForDoctor);

// Profile Update and fetch details
Router.route("/doctor").put(isAuthenticatedDoctor,updateDoctorProfile).delete(isAuthenticatedDoctor, deleteDoctor).get(isAuthenticatedDoctor, getDoctorDetails);



module.exports = Router;