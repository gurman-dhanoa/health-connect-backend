const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const doctorSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name"],
    minLength: [5, "Your name should contain min 5 character"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  qualification: {
    type: String,
    required: [true, "Please enter yuor qualification"],
  },
  specialization: {
    type: String,
    required: [true, "Please Enter Your specialization"],
  },
  gender: {
    type: String,
    required: [true, "Please enter your Gender"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please enter your Date of Birth"],
  },
  experience: {
    type: String,
    required: [true, "Please enter your Experience"],
  },
  discription: {
    type: String,
    required: [true, "Please enter yuor qualification"],
  },
  clinicLocation: {
    street: {
      type: String,
      required: [true, "Please enter street details of current location"],
    },
    city: {
      type: String,
      required: [true, "Please enter city of current location"],
    },
    pincode: {
      type: Number,
      required: [true, "Please enter pincode of current location"],
    },
    state: {
      name: {
        type: String,
        required: [true, "Enter name of your state"],
      },
      coordinates: {
        lat: {
          type: String,
        },
        lng: {
          type: String,
        },
      },
    },
  },
  permanentAddress: {
    street: {
      type: String,
      required: [true, "Please enter street details of current location"],
    },
    city: {
      type: String,
      required: [true, "Please enter city of current location"],
    },
    pincode: {
      type: Number,
      required: [true, "Please enter pincode of current location"],
    },
    state: {
      name: {
        type: String,
        required: [true, "Enter name of your state"],
      },
      coordinates: {
        lat: {
          type: String,
        },
        lng: {
          type: String,
        },
      },
    },
  },
  fees: {
    type: String,
    required: [true, "Please enter your Appointment fees"],
  },
  contactNumber: {
    type: String,
    maxLength: [10, "Contact number can have max 10 character"],
    required: [true, "Please enter your contact number"],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: [true, "Please give rating"],
      },
      comment: {
        type: String,
        required: [true, "Please give your review"],
      },
      image: {
        type: String,
        required: [true, "Please provide image url"],
      },
    },
  ],
  current_status: {
    type: Boolean,
  },
});

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
doctorSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password

doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Doctor", doctorSchema);
