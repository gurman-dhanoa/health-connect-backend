const express = require("express");
const ErrorHandler = require("./middleware/ErrorHandler");
const CookieParser = require("cookie-parser");
const fileupload = require('express-fileupload'); 
const path = require('path');

// importing routes
const doctorRoutes = require("./routes/doctorRoute");
const userRoutes = require("./routes/userRoute");
const appointmentRoute = require("./routes/appointmentRoute");
const analyserRoute = require("./routes/analyserRoute");

const app = express();

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

app.use(fileupload({useTempFiles: true}))
app.use(express.json());
app.use(CookieParser());
app.use(express.static(path.join(__dirname, 'build')));



app.get('/', function (req, res) {
  res.status(200).json({
      success: true,
      message: "Backend is working successfully!!!"
    });
});
app.use("/api/v1", doctorRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", appointmentRoute);
app.use("/api/v1", analyserRoute);

// using middleware
app.use(ErrorHandler);

module.exports = app;
