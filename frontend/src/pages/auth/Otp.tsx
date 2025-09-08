import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { is } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const OtpDialog = ({
    isOpen = false,
    email = '',
    onSubmitRegister = () => { },
    onClose = () => { },
}) => {
    const { sendOtp, verifyOtp } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [time, setTime] = useState(300); // 5 minutes in seconds
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isOpen) {
            timer = setInterval(() => {
                setTime((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [isOpen]);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await verifyOtp(email, otp);
            onSubmitRegister();
            onClose();
        } catch (error) {
            setError('Invalid or expired OTP. Please try again.');
            console.error("OTP verification failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>

            <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto text-zinc-400">
                <DialogHeader>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogDescription>
                        Please enter the OTP sent to your email
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="otp">OTP</label>
                        <Input
                            id="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                </div>

                <div className="text-sm text-zinc-500 text-center">
                    {time > 0 ? (
                        <p>Time remaining: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</p>
                    ) : (
                        <p className="text-red-500">OTP expired. Please request a new one.</p>
                    )}
                </div>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Verify"}
                    </Button>
                    {time === 0 && (
                        <Button variant="link" onClick={async () => {
                            setTime(300);
                            await sendOtp(email);
                        }}>
                            Send Again
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default OtpDialog;
