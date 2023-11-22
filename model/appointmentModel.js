const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
    doctorId:{
        type: mongoose.Types.ObjectId,
        ref:"Doctor"
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    location:{
        street:{
            type:String,
            required:[true,"Please enter street details of current location"]
        },
        city:{
            type:String,
            required:[true,"Please enter city of current location"]
        },
        pincode:{
            type:Number,
            required:[true,"Please enter pincode of current location"]
        },
        state:{
            name:{
                type:String,
                required:[true,"Enter name of your state"]
            },
            coordinates:{
                lat:{
                    type:String,
                },
                lng:{
                    type:String,
                }
            }
        }
    },
    age:{
        type: Number,
        required:[true,"Please enter age"]
    },
    comment:{
        type: String,
    },
    disease:[{
        type:String
    }],
    status: {
        type: String,
        enum : ["NEW","ALLOTED","COMPLETED","CANCEL","CLOSED"],
        default: 'NEW'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    scheduleDate:{
        type:Date,
    },
    private:{
        type:Boolean,
        default:false,
    },
    remark:{
        type: String,
    },
});

module.exports = mongoose.model("Appointment",appointmentSchema);