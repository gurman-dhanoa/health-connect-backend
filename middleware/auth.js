const ErrorHander = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const Doctor = require("../model/doctorModel");
const Analyser = require("../model/analyserModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { userToken } = req.cookies;

  if (!userToken) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(userToken, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id);

  next();
});

exports.isAuthenticatedDoctor = catchAsyncErrors(async (req, res, next) => {
  const { docToken } = req.cookies;

  if (!docToken) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(docToken, process.env.JWT_SECRET);

  req.doctor = await Doctor.findById(decodedData.id);

  next();
});

exports.isAuthenticatedAnalyser = catchAsyncErrors(async (req, res, next) => {
  const { analyserToken } = req.cookies;

  if (!analyserToken) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(analyserToken, process.env.JWT_SECRET);

  req.analyser = await Analyser.findById(decodedData.id);

  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }

    next();
  };
};
