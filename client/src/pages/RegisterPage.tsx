import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Eye, EyeOff, Activity, Wallet, Calendar 
} from 'lucide-react';
import toast from 'react-hot-toast';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import SocialAuthModal from '@/components/auth/SocialAuthModal';
import { authApi } from '@/services';
import { useAuthStore } from '@/store';
import logo from '@/assets/logo.png';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
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
      await authApi.register({ name: data.name, email: data.email, password: data.password });
      toast.success('Registration successful! Please verify your email.');
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(message);
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
      const res = await authApi.googleLogin(credential, 'register');
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Google sign-up failed';
      toast.error(message);
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
        action: 'register'
      });
      setAuth(res.data.data.user, res.data.data.accessToken);
      toast.success(`Account created with ${socialProvider === 'google' ? 'Google' : 'Apple ID'}!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || `${socialProvider === 'google' ? 'Google' : 'Apple'} registration failed`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-sans transition-colors duration-250">
      
      {/* Left Column: Graphic Mockup & Brand Message */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-100 dark:bg-[#080c16] relative overflow-hidden border-r border-slate-200 dark:border-white/5">
        {/* Glow meshes */}
        <div className="absolute top-[-20%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-primary-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-blue-600/5 blur-[110px] pointer-events-none" />

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <img src={logo} alt="LifeOS Logo" className="w-7 h-7 object-contain rounded-lg" />
          <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">LifeOS</span>
        </div>

        {/* Center Mockup Graphic */}
        <div className="relative z-10 my-auto max-w-lg mx-auto w-full">
          <div className="bg-white dark:bg-[#101423] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-2xl relative">
            
            {/* Mockup Browser Top bar */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-white/5 mb-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider font-mono uppercase">Command_Center_v2.0</span>
            </div>

            {/* Quick Actions Tabs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-slate-50 dark:bg-[#171d31] rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center">
                <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400 mb-1.5" />
                <span className="text-[9px] font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">Metrics</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#101925] rounded-xl border border-slate-200 dark:border-emerald-500/10 flex flex-col items-center justify-center">
                <Wallet className="w-4 h-4 text-emerald-500 dark:text-emerald-450 mb-1.5" />
                <span className="text-[9px] font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Finance</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#171d31] rounded-xl border border-slate-200 dark:border-white/5 flex flex-col items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400 mb-1.5" />
                <span className="text-[9px] font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">Schedule</span>
              </div>
            </div>

            {/* Bar Chart Mockup */}
            <div className="h-28 flex items-end gap-3 px-4 py-2 bg-slate-50 dark:bg-[#121625]/40 rounded-xl border border-slate-200 dark:border-white/5 mb-2">
              <span className="flex-1 bg-slate-300 dark:bg-slate-700/30 rounded-t h-[40%]" />
              <span className="flex-1 bg-blue-500/30 rounded-t h-[65%]" />
              <span className="flex-1 bg-slate-300 dark:bg-slate-700/30 rounded-t h-[25%]" />
              <span className="flex-1 bg-emerald-500/30 rounded-t h-[90%]" />
              <span className="flex-1 bg-slate-300 dark:bg-slate-700/30 rounded-t h-[50%]" />
            </div>

            {/* Floating Info Tag */}
            <div className="absolute bottom-[-15px] right-4 bg-white dark:bg-[#141b2c] border border-slate-200 dark:border-white/10 shadow-xl rounded-xl p-2.5 flex items-center gap-2 max-w-[190px]">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-white/15">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Peak Performance</p>
                <p className="text-[8px] text-slate-500 dark:text-slate-400 truncate mt-0.5">98th Percentile Activity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slogan Copy */}
        <div className="relative z-10 max-w-md mt-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
            Your Ultimate Personal Command Center
          </h2>
          <p className="text-slate-600 dark:text-slate-450 text-sm leading-relaxed">
            Stop switching tabs. Manage your schedule, metrics, finances, and study logs in one visual ecosystem.
          </p>
        </div>
      </div>

      {/* Right Column: Sign Up Form & Layout */}
      <div className="flex flex-col justify-between p-6 sm:p-12 md:p-16 bg-white dark:bg-[#0d111d] relative transition-colors duration-250">
        {/* Glow meshes */}
        <div className="absolute bottom-[-15%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between lg:justify-end">
          <div className="lg:hidden flex items-center gap-2">
            <img src={logo} alt="LifeOS Logo" className="w-6 h-6 object-contain rounded-md" />
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">LifeOS</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-900 dark:text-white hover:underline font-bold ml-1">
              Sign In
            </Link>
          </div>
        </div>

        {/* Center Sign Up Card container */}
        <div className="my-auto max-w-sm w-full mx-auto py-12 relative z-10">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Get started today</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5">Join 50,000+ high-performers optimizing their life.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name field */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full bg-slate-50 dark:bg-[#161b26] hover:bg-slate-100 dark:hover:bg-[#1a202d] focus:bg-white dark:focus:bg-[#1e2536] border ${
                  errors.name ? 'border-red-500' : 'border-slate-200 dark:border-white/5'
                } focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all`}
                {...register('name')}
              />
              {errors.name && <p className="text-[10px] text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-slate-50 dark:bg-[#161b26] hover:bg-slate-100 dark:hover:bg-[#1a202d] focus:bg-white dark:focus:bg-[#1e2536] border ${
                  errors.email ? 'border-red-500' : 'border-slate-200 dark:border-white/5'
                } focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all`}
                {...register('email')}
              />
              {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full bg-slate-50 dark:bg-[#161b26] hover:bg-slate-100 dark:hover:bg-[#1a202d] focus:bg-white dark:focus:bg-[#1e2536] border ${
                    errors.password ? 'border-red-500' : 'border-slate-200 dark:border-white/5'
                  } focus:border-blue-500/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all`}
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#4f83f6] hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer mt-4"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/5" />
            </div>
            <span className="relative z-10 px-3 bg-white dark:bg-[#0d111d] text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-250">
              Or continue with
            </span>
          </div>

          {/* OAuth Buttons Grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <GoogleLoginButton onSuccess={handleGoogleLogin} text="signup_with" />

            <button
              type="button"
              onClick={() => handleOpenSocialModal('apple')}
              className="w-full py-2.5 bg-slate-550/5 hover:bg-slate-550/10 border border-slate-200 dark:bg-[#161b26] dark:hover:bg-[#1a202d] dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-sm shrink-0"></span>
              Apple ID
            </button>
          </div>

          <SocialAuthModal
            isOpen={isSocialModalOpen}
            onClose={() => setIsSocialModalOpen(false)}
            provider={socialProvider}
            action="register"
            onSelect={handleSocialAuthSelect}
          />

          <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 leading-normal">
            By creating an account, you agree to our{' '}
            <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a> and{' '}
            <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
          </p>
        </div>

        {/* Page Footer at the bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 border-t border-slate-100 dark:border-white/5 pt-6 mt-12">
          <p>© 2026 LifeOS Technologies. Securely encrypted.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-650 dark:hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-650 dark:hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-650 dark:hover:text-slate-400">Help Center</a>
            <a href="#" className="hover:text-slate-650 dark:hover:text-slate-400">Status</a>
          </div>
        </div>
      </div>
    </div>
  );
}
