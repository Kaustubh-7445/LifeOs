import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight } from 'lucide-react';

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'google' | 'apple';
  action: 'login' | 'register';
  onSelect: (email: string, name: string) => void;
}

export default function SocialAuthModal({
  isOpen,
  onClose,
  provider,
  action,
  onSelect,
}: SocialAuthModalProps) {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');

  const isGoogle = provider === 'google';

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customEmail) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(customEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    const defaultName = customName || (isGoogle ? 'Google User' : 'Apple User');
    onSelect(customEmail.trim(), defaultName.trim());
    resetForm();
  };

  const resetForm = () => {
    setCustomEmail('');
    setCustomName('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-white/5 dark:bg-[#161b26] text-slate-800 dark:text-slate-100 z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md border ${
                isGoogle 
                  ? 'bg-slate-550/5 border-slate-200 dark:bg-[#0d111d] dark:border-white/5' 
                  : 'bg-black border-neutral-800 text-white'
              }`}>
                {isGoogle ? (
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                ) : (
                  <span className="text-2xl font-bold leading-none select-none"></span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {action === 'login' ? 'Sign in with' : 'Sign up with'} {isGoogle ? 'Google' : 'Apple'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your {isGoogle ? 'Google' : 'Apple ID'} email to proceed
              </p>
            </div>

            {/* Main Area Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {/* Custom Email input */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d111d] hover:bg-slate-100 dark:hover:bg-[#101423] focus:bg-white dark:focus:bg-[#121727] border border-slate-200 dark:border-white/5 focus:border-blue-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Custom Name input (only for Register) */}
              {action === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d111d] hover:bg-slate-100 dark:hover:bg-[#101423] focus:bg-white dark:focus:bg-[#121727] border border-slate-200 dark:border-white/5 focus:border-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none transition-all"
                  />
                </div>
              )}

              {error && <p className="text-[10px] text-red-500">{error}</p>}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Security Note */}
            <p className="text-[9px] text-center text-slate-400 dark:text-slate-550 leading-normal mt-6">
              OAuth login is simulated for this environment. No password or verification tokens are required.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
