import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff 
} from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import SocialAuthModal from '@/components/auth/SocialAuthModal';
import { authApi } from '@/services';
import { useAuthStore } from '@/store';

import logo from '@/assets/logo.png';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(message);
      if (message.toLowerCase().includes('verify')) {
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'google' | 'apple'>('google');

  const handleOpenSocialModal = (provider: 'google' | 'apple') => {
    setSocialProvider(provider);
    setIsSocialModalOpen(true);
  };

  const handleGoogleLogin = async (credential: string) => {
    setLoading(true);
    try {
      const res = await authApi.googleLogin(credential, 'login');
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
      const status = errorObj.response?.status;
      const message = errorObj.response?.data?.message || 'Google login failed';

      if (status === 404 || message.toLowerCase().includes('not registered') || message.toLowerCase().includes('sign up')) {
        toast.error('This Google account is not registered. Redirecting to sign up...');
        setTimeout(() => {
          navigate('/register');
        }, 1500);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuthSelect = async (email: string, name: string) => {
    setIsSocialModalOpen(false);
    setLoading(true);
    try {
      const res = await authApi.socialAuth({
        email,
        name,
        provider: socialProvider,
        action: 'login'
      });
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success(`Signed in with ${socialProvider === 'google' ? 'Google' : 'Apple ID'}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
      const status = errorObj.response?.status;
      const message = errorObj.response?.data?.message || `${socialProvider === 'google' ? 'Google' : 'Apple'} authentication failed`;

      if (status === 404 || message.toLowerCase().includes('not registered') || message.toLowerCase().includes('sign up')) {
        toast.error('This account is not registered. Redirecting to sign up...');
        setTimeout(() => {
          navigate('/register');
        }, 1500);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 px-4 relative overflow-hidden font-sans transition-colors duration-250">
      {/* Background glow meshes */}
      <div className="absolute top-[-25%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-primary-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[45rem] h-[45rem] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* Top Header Logo & Branding */}
      <div className="text-center mb-8 relative z-10 flex flex-col items-center justify-center">
        <img src={logo} alt="LifeOS Logo" className="w-12 h-12 object-contain rounded-xl mb-3" />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">LifeOS</h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 uppercase tracking-wider font-semibold">
          Your Ultimate Personal Command Center
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white dark:bg-[#161b26] border border-slate-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <Mail className="w-4.5 h-4.5 text-slate-400 dark:text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-slate-50 dark:bg-[#0d111d] hover:bg-slate-100 dark:hover:bg-[#101423] focus:bg-white dark:focus:bg-[#121727] border ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-white/5'
                } focus:border-blue-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all`}
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
              <Link to="/forgot-password" className="text-[9px] font-bold text-slate-400 dark:text-slate-450 hover:text-slate-800 dark:hover:text-white uppercase tracking-wider transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 text-slate-400 dark:text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full bg-slate-50 dark:bg-[#0d111d] hover:bg-slate-100 dark:hover:bg-[#101423] focus:bg-white dark:focus:bg-[#121727] border ${
                  errors.password ? 'border-red-500' : 'border-slate-200 dark:border-white/5'
                } focus:border-blue-500/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-805 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4f83f6] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer mt-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto block" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/5" />
          </div>
          <span className="relative z-10 px-3 bg-white dark:bg-[#161b26] text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest transition-colors duration-250">
            Or continue with
          </span>
        </div>

        {/* OAuth Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
            <div className="relative flex-1">
              <div className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer z-20">
                <GoogleLoginButton onSuccess={handleGoogleLogin} text="signin_with" />
              </div>
              <button
                type="button"
                className="w-full py-2.5 bg-slate-550/5 hover:bg-slate-550/10 border border-slate-200 dark:bg-[#0d111d] dark:hover:bg-[#101423] dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 pointer-events-none"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5" />
                Google
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenSocialModal('google')}
              className="w-full py-2.5 bg-slate-550/5 hover:bg-slate-550/10 border border-slate-200 dark:bg-[#0d111d] dark:hover:bg-[#101423] dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5" />
              Google
            </button>
          )}

          <button
            type="button"
            onClick={() => handleOpenSocialModal('apple')}
            className="w-full py-2.5 bg-slate-550/5 hover:bg-slate-550/10 border border-slate-200 dark:bg-[#0d111d] dark:hover:bg-[#101423] dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-sm shrink-0"></span>
            Apple
          </button>
        </div>

        <SocialAuthModal
          isOpen={isSocialModalOpen}
          onClose={() => setIsSocialModalOpen(false)}
          provider={socialProvider}
          action="login"
          onSelect={handleSocialAuthSelect}
        />
      </motion.div>

      {/* Redirection Links */}
      <div className="mt-8 text-center text-xs text-slate-550 dark:text-slate-400 relative z-10">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-350 font-bold ml-1 transition-colors">
          Join the ecosystem
        </Link>
      </div>

      {/* Footer Links */}
      <div className="mt-16 flex gap-4 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-white/5 pt-6 w-full max-w-sm justify-center relative z-10">
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-405 transition-colors">Privacy Policy</a>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <a href="#" className="hover:text-slate-600 dark:hover:text-slate-405 transition-colors">Terms of Service</a>
      </div>
    </div>
  );
}
