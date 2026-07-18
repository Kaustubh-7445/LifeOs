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
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState('');

  const mockGoogleAccounts = [
    { email: 'john.doe@gmail.com', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=face' },
    { email: 'jane.smith@gmail.com', name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face' },
  ];

  const mockAppleAccounts = [
    { email: 'apple-user@lifeos.app', name: 'Apple User', avatar: '' },
    { email: 'steve.jobs@apple.com', name: 'Steve Jobs', avatar: '' },
  ];

  const accounts = provider === 'google' ? mockGoogleAccounts : mockAppleAccounts;
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
    setShowCustomInput(false);
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
                  ? 'bg-slate-50 border-slate-150 dark:bg-[#0d111d] dark:border-white/5' 
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
                Select an account to proceed to LifeOS
              </p>
            </div>

            {/* Main Area */}
            {!showCustomInput ? (
              <div className="space-y-3">
                {/* Accounts List */}
                <div className="space-y-2">
                  {accounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => onSelect(acc.email, acc.name)}
                      className="w-full flex items-center gap-3 p-3 text-left rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 dark:border-white/5 dark:hover:border-white/10 dark:hover:bg-[#1f2638] transition-all cursor-pointer group"
                    >
                      {isGoogle ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                          <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black text-white text-base font-semibold">
                          
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                          {acc.name}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {acc.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="relative py-2 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-white/5" />
                  </div>
                  <span className="relative z-10 px-3 bg-white dark:bg-[#161b26] text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Or
                  </span>
                </div>

                {/* Toggle Custom Input Button */}
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 dark:bg-[#0d111d] dark:hover:bg-[#101423] dark:border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Use another account
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                {/* Custom Email input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full bg-slate-550/5 hover:bg-slate-550/10 dark:bg-[#0d111d] dark:hover:bg-[#101423] focus:bg-white dark:focus:bg-[#121727] border border-slate-250 dark:border-white/5 focus:border-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none transition-all"
                  />
                </div>

                {/* Custom Name input (only for Register) */}
                {action === 'register' && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full bg-slate-550/5 hover:bg-slate-550/10 dark:bg-[#0d111d] dark:hover:bg-[#101423] focus:bg-white dark:focus:bg-[#121727] border border-slate-250 dark:border-white/5 focus:border-blue-500/50 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none transition-all"
                    />
                  </div>
                )}

                {error && <p className="text-[10px] text-red-500">{error}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Back button */}
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="w-full text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 hover:text-slate-600 dark:text-slate-550 dark:hover:text-slate-300 py-1 transition-colors cursor-pointer"
                >
                  Back to options
                </button>
              </form>
            )}

            {/* Security Note */}
            <p className="text-[9px] text-center text-slate-400 dark:text-slate-550 leading-normal mt-6">
              OAuth login is mocked for this environment. No actual password or external auth token is required.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
