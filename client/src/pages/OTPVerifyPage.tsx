import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { authApi } from '@/services';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function OTPVerifyPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (!email) {
      toast.error('Invalid access. Email is missing.');
      navigate('/register');
    }
  }, [email, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Only allow digits

    const newOtp = [...otp];
    // Keep only the last character entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Backspace focuses previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Validate 6-digit number

    const pastedDigits = pastedData.split('');
    setOtp(pastedDigits);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.verifyOtp(email, otpCode);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success('Email verified successfully! Welcome to LifeOS.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      // Endpoint to resend OTP
      await authApi.resendOtp(email);
      toast.success('A new 6-digit verification code has been sent to your email.');
      setResendTimer(60);
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to resend code.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Background Mesh Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            We've sent a 6-digit verification code to <span className="font-semibold text-gray-700 dark:text-gray-300">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Box Containers */}
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all dark:text-white shadow-sm"
              />
            ))}
          </div>

          <Button type="submit" className="w-full py-3 text-base flex justify-center items-center gap-2" loading={isLoading}>
            Verify & Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-8 text-center flex flex-col items-center gap-2">
          {resendTimer > 0 ? (
            <p className="text-xs text-gray-400">
              Resend code in <span className="font-semibold">{resendTimer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1.5 focus:outline-none transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Resend Code
            </button>
          )}

          <button
            onClick={() => navigate('/login')}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mt-2 underline underline-offset-4"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
