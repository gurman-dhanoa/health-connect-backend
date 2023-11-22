const express = require("express");
const { loginAnalyser, registerAnalyser, logout, getProfile, fetchAppointments, sendEmailToUser } = require("../controller/analyserController");
const { isAuthenticatedAnalyser } = require("../middleware/auth");
const { getAppAnalyser } = require("../controller/appointmentController");


const Router = express.Router();

// Authentication
Router.route("/analyser/login").post(loginAnalyser);
Router.route("/analyser/register").post(registerAnalyser);
Router.route("/analyser/logout").put(logout);

// Profile
Router.route("/analyser/profile").get(isAuthenticatedAnalyser,getProfile);
Router.route("/analyser/email").get(sendEmailToUser);

// Routes
Router.route("/analyser/appointments").get(getAppAnalyser);

module.exports = Router;