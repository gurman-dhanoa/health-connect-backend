const express = require("express");
const { getAllUser, loginUser, logout , createUser, updateUserProfile, deleteUser, getUserDetails, createDoctorReview } = require("../controller/userController");
const { getAllDoctors, getDoctorDetailsForUser } = require("../controller/doctorController");
const { deleteAppointment, getUserCompletedAppointments, getUserPendingAppointments, createAppointment, getAppointmentDetailsUser, userUpdateappointment, getUserPrivateAppointments } = require("../controller/appointmentController");
const {isAuthenticatedUser} = require("./../middleware/auth");
const Router = express.Router();

Router.route("/users").get(getAllUser); //Admin

// user fetch doctor profile
Router.route("/user/doctors").get(getAllDoctors);
Router.route("/user/doctor/:id").get(getDoctorDetailsForUser);

// Login Logout and register
Router.route("/user/login").post(loginUser);
Router.route("/user/logout").put(logout);
Router.route("/user/new").post(createUser);

// Profile Update and fetch details
Router.route("/user/profile").put(isAuthenticatedUser,updateUserProfile).delete(isAuthenticatedUser,deleteUser).get(isAuthenticatedUser,getUserDetails);

// Appointments Routes

// Create new appointment
Router.route("/user/appointment/new/:id").post(isAuthenticatedUser,createAppointment);

// Upcomming appointments
Router.route("/user/appointments").get(isAuthenticatedUser,getUserPendingAppointments);

// cancel an appointment
Router.route("/user/appointment/:id").delete(isAuthenticatedUser,deleteAppointment).get(isAuthenticatedUser,getAppointmentDetailsUser).post(isAuthenticatedUser,userUpdateappointment);

// Completed appointments or Previous record
Router.route("/user/oldAppointments").get(isAuthenticatedUser,getUserCompletedAppointments);
Router.route("/user/privateAppointments").get(isAuthenticatedUser,getUserPrivateAppointments);

Router.route("/user/review").put(isAuthenticatedUser,createDoctorReview);


module.exports = Router;