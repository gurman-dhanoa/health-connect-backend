const Doctor = require("../model/doctorModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const {sendDocToken} = require("../utils/jwtToken");
const cloudinary = require("cloudinary");

// Get all doctors
exports.getAllDoctors = catchAsyncError(async (req, res,next) => {
  try {
    const { name,city, rating, state, specialization } = req.query;

    const query = {};

    if (name) {
      query.name = {$regex: name };
    }

    if (rating) {
      query.rating = { $gte: rating };
    }
    if (specialization) {
      query.specialization = specialization;
    }

    if(city){
      query['clinicLocation.city'] = city;
    }
    if(state){
      query['clinicLocation.state.name'] = state;
    }
    const doctors = await Doctor.find(query);
    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Doctor
exports.loginDoctor = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const doctor = await Doctor.findOne({ email }).select("+password");

  if (!doctor) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await doctor.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendDocToken(doctor, 200, res);
});

// Logout Doctor
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("docToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Create new doctor
exports.createNewDoctor = catchAsyncError(async (req, res,next) => {
  const {name,
    email,
    password,
    qualification,
    specialization,
    gender,
    dateOfBirth,
    experience,
    discription,
    clinicStreet,
    clinicCity,
    clinicNumber,
    clinicState,
    permanentStreet,
    permanentCity,
    permanentNumber,
    permanentState,
    fees,
    contactNumber,
    current_status,} = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(req.body.images, {
      folder: "images",
      width: 150,
      crop: "scale",
    });
  const newDoctor = await Doctor.create({name,
    email,
    password,
    qualification,
    specialization,
    gender,
    dateOfBirth,
    experience,
    discription,
    clinicLocation:{
      street:clinicStreet,
      city:clinicCity,
      pincode:clinicNumber,
      state:{
        name:clinicState,
      }
    },
    permanentAddress:{
      street:permanentStreet,
      city:permanentCity,
      pincode:permanentNumber,
      state:{
        name:permanentState,
      }
    },
    fees,
    contactNumber,
    current_status,
    image: { public_id: myCloud.public_id, url: myCloud.secure_url },});
  sendDocToken(newDoctor, 201, res);
});

// Update doctor profile
exports.updateDoctorProfile = catchAsyncError(async (req, res,next) => {
  let doctor = await Doctor.findById(req.doctor);
  
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found",404));
  }

  const newDoctor = await Doctor.findByIdAndUpdate(req.doctor,req.body,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: "true",
    newDoctor
  })
});

// Delete doctor
exports.deleteDoctor = catchAsyncError(async(req,res,next) => {
  let doctor = await Doctor.findById(req.doctor);
  
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found",404));
  }

  await doctor.remove();

  res.status(200).json({
    success:"true",
    message:"doctor deleted successfully"
  })
});

// get doctor details  -- For doctor
exports.getDoctorDetails = catchAsyncError(async(req,res,next) => {
  let doctor = await Doctor.findById(req.doctor);
  
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found",404));
  }

  res.status(200).json({
    success:"true",
    doctor
  })
});

// get doctor details  -- For user
exports.getDoctorDetailsForUser = catchAsyncError(async(req,res,next) => {
  let doctor = await Doctor.findById(req.params.id);
  
  if (!doctor) {
    return next(new ErrorHandler("Doctor not found",404));
  }

  res.status(200).json({
    success:"true",
    doctor
  })
});