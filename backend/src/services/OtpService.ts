import Otp from "@/models/Otp";

class OtpService {
    public async createOtp(email: string): Promise<string | null> {
        const otp = this.generateOtp();
        const otpRecord = new Otp({ email, otp });
        await otpRecord.save();
        return otp;
    }

    public async verifyOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) return false;
        await Otp.deleteOne({ _id: otpRecord._id });
        return true;
    }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

export default new OtpService();
