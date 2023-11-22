const express = require("express");
const {  getAllAppointments} = require("../controller/appointmentController");


const Router = express.Router();

Router.route("/appointments").get(getAllAppointments);   //get all the appointments -- Admin

module.exports = Router;