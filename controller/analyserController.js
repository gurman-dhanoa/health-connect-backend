const Analyser = require("../model/analyserModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/sendEmail")
const catchAsyncError = require("../middleware/catchAsyncError");
const { sendAnalyserModel } = require("../utils/jwtToken");
const Appointment = require("../model/appointmentModel");
const cloudinary = require("cloudinary");

// Login - done
// Register - done
// Logout - done
// get Profile - done
// Forget Password
// List of appointments

// Create new analyser
exports.registerAnalyser = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    password,
    gender,
    dateOfBirth,
    permanentStreet,
    permanentCity,
    permanentNumber,
    permanentState,
    contactNumber
  } = req.body;
  const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
    folder: "images",
    width: 150,
    crop: "scale",
  });
  const analyser = await Analyser.create({
    name,
    email,
    password,
    gender,
    dateOfBirth:dateOfBirth,
    address:{
      street:permanentStreet,
      city:permanentCity,
      pincode:permanentNumber,
      state:permanentState,
    },
    contactNumber,
    image: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });
  sendAnalyserModel(analyser, 201, res);
});

// Login Analyser
exports.loginAnalyser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const analyser = await Analyser.findOne({ email }).select("+password");

  if (!analyser) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await analyser.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendAnalyserModel(analyser, 200, res);
});

// Logout Analyser
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("analyserToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// get profile
exports.getProfile = catchAsyncError(async(req,res,next)=>{
  let analyser = await Analyser.findById(req.analyser);
  
  if (!analyser) {
    return next(new ErrorHandler("Analyser not found",404));
  }

  res.status(200).json({
    success:"true",
    analyser
  })
})

// get appointments
exports.fetchAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find({},{date:1,disease:1,userId:1}).populate({path:"userId",model:'user'});
  // const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    "Total appointments": appointments.length,
    appointments,
  });
});

// Forgot Password
exports.sendEmailToUser = catchAsyncError(async (req, res, next) => {

  try {
    await sendEmail({
      email: 'gurmandhanoa0001@gmail.com',
      subject: `Ecommerce Password Recovery`,
      message:"Gurman Singh",
    });

    res.status(200).json({
      success: true,
      message: `Email sent successfully`,
    });
  } catch (error) {
    return next(new ErrorHander(error.message, 500));
  }
});