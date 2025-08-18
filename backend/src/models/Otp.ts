import mongoose from "mongoose";

/**
 * Bảng OTP (One Time Password)
 * @typedef Otp
 */
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '5m', // OTP will expire after 5 minutes
    },
});

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
