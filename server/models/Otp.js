import mongoose from "mongoose"

// Define the OTP schema
const otpSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    }
});

// Create a Mongoose model based on the schema
export default mongoose.model('Otp', otpSchema);
