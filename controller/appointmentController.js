const Appointment = require("../model/appointmentModel");
const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");
const cloudinary = require("cloudinary");

const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");

// all appointment Admin -- Done
// Create -- Done
// Time allocation
// prescription update
// cancel appointment -- Done
// doctor pending appointment -- Done
// user pending appointment -- Done
// user completed appointments
// appointment details -- Done

// get all appointments -Admin
exports.getAllAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    "Total appointments": appointments.length,
    appointments,
  });
});

// Create new appointment
exports.createAppointment = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user);

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return next(new ErrorHandler("doctor not exist", 404));
  }

  const { date, comment } = req.body;
  const calculateAge = (givenBirthDate) => {
      var today = new Date();
      var birthDate = new Date(givenBirthDate);
      var difference = today.getTime() - birthDate.getTime();
      var age = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
      return age;
    }
  const appointment = await Appointment.create({
    doctorId: doctor._id,
    userId: user._id,
    location:user.permanentAddress, 
    age:calculateAge(user.dateOfBirth),
    scheduleDate:date,
    comment,
  });

  res.status(200).json({
    success: true,
    appointment,
  });
});

// Get appointment details -- User
exports.getAppointmentDetailsUser = catchAsyncError(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("appointment not exist", 404));
  }
  const user = await User.findById(appointment.userId);

  if (appointment.userId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You cannot access this resourse", 404));
  }

  const doctor = await Doctor.findById(appointment.doctorId);

  res.status(200).json({
    success: true,
    doctor,
    user,
    appointment,
  });
});

// Get appointment details -- Doctor
exports.getAppointmentDetailsDoctor = catchAsyncError(
  async (req, res, next) => {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(new ErrorHandler("appointment not exist", 404));
    }
    if (appointment.doctorId.toString() != req.doctor._id.toString()) {
      return next(new ErrorHandler("You cannot access this resourse", 404));
    }
    const doctor = await Doctor.findById(appointment.doctorId);
    const user = await User.findById(appointment.userId);

    res.status(200).json({
      success: true,
      doctor,
      user,
      appointment,
    });
  }
);

// get pending appointments of patient or coming appointments
exports.getUserPendingAppointments = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user) {
    return next(new ErrorHandler("user not exist", 404));
  }

  const appointments = await Appointment.find({ userId: req.user }).populate({path:"doctorId",model:'Doctor'});
  res.status(200).json({
    success: true,
    "Total appointments": appointments.length,
    appointments,
  });
});

// get completed appointments of patient OR previous medical history  // both can access but when logged in
exports.getUserCompletedAppointments = catchAsyncError(
  async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) {
      return next(new ErrorHandler("user not exist", 404));
    }

    const appointments = await Appointment.find({
      userId: req.user,
      status: "CLOSED",
      private: false
    }).populate({path:"doctorId",model:'Doctor'});
    res.status(200).json({
      success: true,
      "Total appointments": appointments.length,
      appointments,
    });
  }
);

// get user private appointments
exports.getUserPrivateAppointments = catchAsyncError(
  async (req, res, next) => {
    const user = await User.findById(req.user);
    if (!user) {
      return next(new ErrorHandler("user not exist", 404));
    }

    const appointments = await Appointment.find({
      userId: req.user,
      status: "CLOSED",
      private: true
    }).populate({path:"doctorId",model:'Doctor'});
    res.status(200).json({
      success: true,
      "Total appointments": appointments.length,
      appointments,
    });
  }
);

// Cancel Appointment
exports.deleteAppointment = catchAsyncError(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  if (appointment.userId.toString() != req.user._id.toString()) {
    return next(new ErrorHandler("You cannot access this resourse", 404));
  }
  await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "CANCEL" },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: "true",
    message: "appointment cancelled successfully",
  });
});

// get pending appointments of doctor
exports.getDoctorPendingAppointments = catchAsyncError(
  async (req, res, next) => {
    const doctor = await Doctor.findById(req.doctor);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not exist", 404));
    }
    const appointments = await Appointment.find({ doctorId: req.doctor }).populate({path:"userId",model:'User'});
    res.status(200).json({
      success: true,
      "Total appointments": appointments.length,
      appointments,
    });
  }
);

// get completed appointments of doctor
exports.getDoctorCompletedAppointments = catchAsyncError(
  async (req, res, next) => {
    const doctor = await Doctor.findById(req.doctor);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not exist", 404));
    }
    const appointments = await Appointment.find({
      doctorId: req.doctor,
      $or:[{"status":"COMPLETED"},{"status":"CLOSED"}]
    }).populate({path:"userId",model:'User'});
    res.status(200).json({
      success: true,
      "Total appointments": appointments.length,
      appointments,
    });
  }
);

// get completed and done appointments for analyser
exports.getAppAnalyser = catchAsyncError(
  async (req, res, next) => {
    try {
      const { diseases, minAge, maxAge, state } = req.query;
  
      const query = {};
  
      if (diseases) {
        query.disease = { $in: diseases };
      }
  
      if (minAge && maxAge) {
        query.age = { $gte: minAge, $lte: maxAge };
      }
      if(state){
        query['location.state.name'] = state;
      }
      const appointments = await Appointment.find(query);
      res.status(200).json({
        success: true,
        "Total appointments": appointments.length,
        appointments,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
exports.getAppCityAnalyser = catchAsyncError(
  async (req, res, next) => {
    try {
      const { state, diseases } = req.query;
  
      const appointments = await Appointment.aggregate([
        {
          $match: {
            'location.state.name': state,
            disease: { $elemMatch: { $eq: diseases } },
          },
        },
        {
          $group: {
            _id: '$location.city',
            cases: { $sum: 1 }, // Count the number of cases for each city
          },
        },
        {
          $project: {
            _id: 0,
            city: '$_id',
            cases: 1,
          },
        },
      ]);  
      res.status(200).json({
        success: true,
        appointments,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update appointment
exports.updateappointment = catchAsyncError(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  if (appointment.doctorId.toString() != req.doctor._id.toString()) {
    return next(new ErrorHandler("You cannot access this resourse", 404));
  }

  const newAppData = {};

  if (req.body.status !== "") {
    newAppData.status = req.body.status;
  }
  if (req.body.disease !== "") {
    newAppData.disease = req.body.disease;
  }
  if (req.body.date !== "") {
    newAppData.scheduleDate = req.body.date;
  }
  const newAppointment = await Appointment.findByIdAndUpdate(req.params.id,newAppData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: "true",
    newAppointment,
  });
});


// User Update appointment
exports.userUpdateappointment = catchAsyncError(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }
  if (appointment.userId.toString() != req.user._id.toString()) {
    return next(new ErrorHandler("You cannot access this resourse", 404));
  }

  const newAppData = {};

  if (req.body.status !== "") {
    newAppData.status = req.body.status;
  }
  if (req.body.private !== "") {
    newAppData.private = req.body.private;
  }
  if (req.body.remark !== "") {
    newAppData.remark = req.body.remark;
  }

  const newAppointment = await Appointment.findByIdAndUpdate(req.params.id,newAppData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: "true",
    newAppointment,
  });
});
