import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Search, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';
import { API_URL } from '@/services/api';

interface SocialAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'apple' | 'all';
  hasGoogle?: boolean;
  hasApple?: boolean;
  isVerified?: boolean;
  lastLogin: string;
  createdAt: string;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [connecting, setConnecting] = useState(true);

  const isGoogle = provider === 'google';
  const lastUserEmail = (typeof window !== 'undefined' ? localStorage.getItem('lifeos_last_user_email') : '') || '';

  // Real-time EventSource account list stream
  useEffect(() => {
    if (!isOpen) return;

    setConnecting(true);
    const streamUrl = `${API_URL}/auth/social-accounts/live`;
    const eventSource = new EventSource(streamUrl, { withCredentials: true });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setAccounts(data);
        }
        setConnecting(false);
      } catch (err) {
        console.error('Error parsing social accounts stream:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      setConnecting(false);
    };

    return () => {
      eventSource.close();
    };
  }, [isOpen]);

  const handleAccountSelect = (email: string, name: string) => {
    try {
      localStorage.setItem('lifeos_last_user_email', email);
    } catch {
      // Ignore storage errors
    }
    onSelect(email, name);
    resetForm();
  };

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
    handleAccountSelect(customEmail.trim(), defaultName.trim());
  };

  const resetForm = () => {
    setCustomEmail('');
    setCustomName('');
    setSearchQuery('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Sort & filter available existing accounts
  const sortedAccounts = [...accounts].sort((a, b) => {
    const aIsLast = a.email.toLowerCase() === lastUserEmail.toLowerCase();
    const bIsLast = b.email.toLowerCase() === lastUserEmail.toLowerCase();
    if (aIsLast && !bIsLast) return -1;
    if (!aIsLast && bIsLast) return 1;

    const aHasProv = isGoogle ? a.hasGoogle : a.hasApple;
    const bHasProv = isGoogle ? b.hasGoogle : b.hasApple;
    if (aHasProv && !bHasProv) return -1;
    if (!aHasProv && bHasProv) return 1;

    return new Date(b.lastLogin || b.createdAt).getTime() - new Date(a.lastLogin || a.createdAt).getTime();
  });

  const filteredAccounts = sortedAccounts.filter((acc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return acc.name.toLowerCase().includes(q) || acc.email.toLowerCase().includes(q);
  });

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
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-white/5 dark:bg-[#161b26] text-slate-800 dark:text-slate-100 z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/5 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col items-center text-center mt-1 mb-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md border ${
                isGoogle 
                  ? 'bg-slate-50 border-slate-200 dark:bg-[#0d111d] dark:border-white/5' 
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
                Select your existing account or enter a new email
              </p>
            </div>

            {/* Real-time Existing Accounts List */}
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>Your Existing Accounts ({accounts.length})</span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </label>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">Live sync</span>
              </div>

              {/* Search Filter if more than 3 accounts */}
              {accounts.length > 3 && (
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search existing accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0d111d] border border-slate-200 dark:border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              )}

              {connecting && accounts.length === 0 ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 border border-dashed border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#0d111d]/50">
                  <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-slate-400">Loading existing accounts...</span>
                </div>
              ) : filteredAccounts.length === 0 ? (
                <div className="py-5 px-4 text-center border border-dashed border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#0d111d]/50">
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {searchQuery ? 'No matching accounts found.' : 'No registered accounts found yet. Connect below!'}
                  </p>
                </div>
              ) : (
                <div className="max-h-[190px] overflow-y-auto pr-1 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/5">
                  {filteredAccounts.map((acc) => {
                    const isDeviceAccount = acc.email.toLowerCase() === lastUserEmail.toLowerCase();
                    const hasProviderLinked = isGoogle ? acc.hasGoogle : acc.hasApple;

                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => handleAccountSelect(acc.email, acc.name)}
                        className={`w-full flex items-center gap-3 p-2.5 text-left rounded-xl transition-all cursor-pointer group active:scale-[0.99] border ${
                          isDeviceAccount
                            ? 'bg-blue-50/70 dark:bg-blue-950/20 border-blue-500/40 shadow-sm'
                            : 'bg-slate-50 hover:bg-blue-50/40 dark:bg-[#0d111d] dark:hover:bg-[#161f36] border-slate-200 dark:border-white/5 hover:border-blue-500/30'
                        }`}
                      >
                        {/* Avatar / Monogram */}
                        <div className="relative shrink-0 w-9 h-9 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-xs font-extrabold text-slate-700 dark:text-slate-200">
                          {acc.avatar ? (
                            <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                          ) : (
                            acc.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          )}
                          {isDeviceAccount && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-[#161b26]" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">
                              {acc.name}
                            </h4>
                            {acc.isVerified && (
                              <span title="Verified Account" className="shrink-0 flex items-center">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                            {acc.email}
                          </p>

                          {/* Account Badges */}
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {isDeviceAccount && (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/20">
                                <UserCheck className="w-2.5 h-2.5" />
                                Your Device Account
                              </span>
                            )}
                            {hasProviderLinked ? (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {isGoogle ? 'Google Linked' : 'Apple Linked'}
                              </span>
                            ) : (
                              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-medium">
                                Ready to Link
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Selection Action Indicator */}
                        <div className="text-[10px] font-bold text-blue-500 dark:text-blue-400 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 pr-1">
                          Select &rarr;
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Divider to New Account Connect */}
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/5" />
              </div>
              <span className="relative z-10 px-3 bg-white dark:bg-[#161b26] text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Or enter another email address
              </span>
            </div>

            {/* Main Area Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
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
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                <span>Continue with {isGoogle ? 'Google' : 'Apple'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Security Note */}
            <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 leading-normal mt-5">
              OAuth login is simulated for this environment. Selecting an existing account automatically logs you in.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
