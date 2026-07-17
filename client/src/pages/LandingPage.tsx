import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Play, CheckCircle, BarChart3, Target, Wallet,
  BookOpen, Brain, Zap, Check, Shield, HelpCircle, Activity, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const features = [
  { icon: Target, title: 'Planner', desc: 'Unified calendar and tasks manager built for trackable focus blocks.' },
  { icon: Wallet, title: 'Wealth', desc: 'Real-time cost tracking, monthly budgeting, and automated savings goals.' },
  { icon: BookOpen, title: 'Knowledge', desc: 'A "second brain" for your study logs, course notes, and bookmarks.' },
  { icon: Brain, title: 'AI Coach', desc: 'Personalized insights and productivity tips from our virtual mentor.' },
];

const pricingPlans = [
  {
    name: 'Standard',
    price: '$0',
    desc: 'Perfect for getting started with basic life tracking.',
    features: ['Basic Planner', 'Habits Tracking (Up to 3)', 'Basic Analytics', 'Manual Sync'],
    cta: 'Start for Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    desc: 'Supercharge your growth with full AI features and analytics.',
    features: ['Unlimited Planner', 'AI Coach Integration', 'Advanced Analytics Reports', 'AES-256 Encrypted Sync', 'Priority Support'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Executive',
    price: '$49',
    desc: 'For high-performers seeking elite optimization.',
    features: ['All Pro Features', 'Weekly AI Summaries', '1-on-1 Strategy Setup', 'Early Access to New Modules', '24/7 Dedicated Support'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function LandingPage() {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (92 / 100) * circumference;

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-primary-500/30">
      {/* Decorative background glow lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[55rem] h-[55rem] rounded-full bg-primary-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[55rem] h-[55rem] rounded-full bg-purple-650/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] left-[45%] w-[45rem] h-[45rem] rounded-full bg-pink-650/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950 to-slate-950 z-0 opacity-30 grid-bg" />

      {/* Floating Glassmorphic Navbar */}
      <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-350 bg-clip-text text-transparent">
              LifeOS
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#wealth" className="hover:text-white transition-colors">Wealth</a>
            <a href="#knowledge" className="hover:text-white transition-colors">Knowledge</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register">
              <button className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg shadow-primary-500/10 transition-all cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 px-6 lg:px-8 pt-24 pb-20 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-inner animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Version 1.0 Now Live
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7.5xl font-black leading-tight tracking-tight mb-6 text-white uppercase">
            Your Ultimate Personal<br />
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Command Center
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Supercharge your productivity: organize, optimize, and own your life. An all-in-one ecosystem for everything that matters.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xl shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <a href="#features" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Play className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Watch the Demo</span>
              </button>
            </a>
          </div>
        </motion.div>

        {/* Browser App Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto rounded-3xl border border-white/5 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-md"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-slate-950/40 rounded-t-2xl mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] text-slate-550 tracking-wider font-mono uppercase">Command_Center_v2.0</span>
          </div>

          {/* Inner Mock Grid */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-5 text-left bg-slate-950/80 rounded-b-2xl">
            {/* Left widget: Data Pulse */}
            <div className="p-4 rounded-2xl border border-white/5 bg-[#161b26]/50 flex flex-col justify-between h-44">
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Data Pulse</p>
                <p className="text-xl font-bold mt-2 text-white">Focus capacity up 12% this week</p>
              </div>
              <div className="h-16 flex items-end gap-1.5 bg-[#121625]/20 p-2 rounded-lg border border-white/5">
                {[30, 45, 35, 60, 50, 75].map((h, i) => (
                  <span key={i} className="flex-1 bg-emerald-500/20 border border-emerald-500/30 rounded-t-md" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Middle widget: Tasks List */}
            <div className="p-4 rounded-2xl border border-white/5 bg-[#161b26]/50 flex flex-col justify-between h-44">
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Upcoming Tasks</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#1e2536]/40 border border-white/5">
                    <span className="text-white font-medium truncate">User Interface Design</span>
                    <span className="text-[8px] bg-red-400/10 text-red-400 px-1.5 py-0.5 rounded-full font-bold">High</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#1e2536]/40 border border-white/5">
                    <span className="text-white font-medium truncate">Learning Rust</span>
                    <span className="text-[8px] bg-purple-400/10 text-purple-400 px-1.5 py-0.5 rounded-full font-bold">Study</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right widget: Savings and streak summary */}
            <div className="grid grid-rows-2 gap-4 h-44">
              <div className="p-3 bg-[#161b26]/50 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-550 uppercase tracking-widest font-bold">Wealth Balance</p>
                  <p className="text-lg font-extrabold text-white mt-1">$15,450.00</p>
                </div>
                <Wallet className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="p-3 bg-[#161b26]/50 border border-white/5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-550 uppercase tracking-widest font-bold">Habit Streaks</p>
                  <p className="text-lg font-extrabold text-white mt-1">12 Days</p>
                </div>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Ecosystem Section */}
      <section id="features" className="relative z-10 px-6 lg:px-8 py-24 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400">The Unified Ecosystem</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 uppercase">Stop switching between 10 different apps</h2>
          <p className="text-slate-400 mt-4 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            LifeOS brings your entire digital existence into one high-performance command center.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#161b26]/30 border border-white/5 rounded-2xl p-6 hover:border-primary-500/25 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 transition-all">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Strategist Section */}
      <section className="relative z-10 px-6 lg:px-8 py-20 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Your Personal Advisor</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2 leading-tight uppercase">
              Your Personal Strategist
            </h2>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed mb-8">
              The LifeOS AI doesn't just store data. It understands your patterns, detects when you are likely to crash, and guides you on how to optimize your day based on your peak focus cycles.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Energy-Based Scheduling</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Automatically suggest deep work in your peak focus windows.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Syntheses</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Receive a custom insights wrap-up of your habits, notes, and productivity levels.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: AI Coach dialogue card */}
          <div className="bg-[#161b26] border border-[#222736] rounded-3xl p-6 shadow-xl max-w-md mx-auto w-full">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Gemini Coach</h4>
                <p className="text-[9px] text-slate-500 mt-0.5">Active Coaching</p>
              </div>
            </div>

            <div className="bg-[#121625]/40 border border-white/5 p-4 rounded-2xl mb-5">
              <p className="text-xs text-slate-350 leading-relaxed">
                "Good morning, Alex. You're at 94% focus capacity. A standard study block is scheduled for 10:00 AM. Ready to begin?"
              </p>
              <button 
                onClick={() => toast.success('Coaching routine started!')}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                Sounds perfect. Let's start.
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-[#1e2536]/30 border border-white/5 p-3 rounded-xl font-bold">
              <span>Read: Your <span className="text-emerald-400">Productivity Score</span> is heading +12% higher than average. Keep it up!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity Analytics Showcase */}
      <section className="relative z-10 px-6 lg:px-8 py-20 max-w-6xl mx-auto border-t border-white/5">
        <div className="bg-[#161b26]/50 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400">Productivity Analytics</span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2 uppercase">Stop guessing.</h2>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed mb-6">
              Visualize your output with deep, data-driven insights. Our algorithms calculate your personal 'Productivity Score' by combining task output, focus cycles, and habit consistency.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-black text-white">84%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Productivity Rate</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">+2.4%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Daily Focus Sessions</p>
              </div>
            </div>
          </div>

          {/* SVG Score Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r={radius} className="stroke-[#1e2536]" strokeWidth="8" fill="transparent" />
              <circle cx="72" cy="72" r={radius} className="stroke-blue-500 transition-all duration-500" strokeWidth="8" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white leading-none">92</span>
              <span className="text-[9px] font-bold text-slate-500 tracking-widest mt-1 uppercase">Score</span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative z-10 px-6 lg:px-8 py-20 max-w-4xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400">One Tool, Every Area</span>
          <h2 className="text-2xl font-extrabold text-white mt-1.5 uppercase">Connect your tasks, habits, and goals</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#161b26]/40 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Daily Habits</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 border border-emerald-500/20 rounded-full">Routine Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#161b26]/40 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Financial Milestones</span>
            </div>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 border border-blue-500/20 rounded-full">$15.0K Saved</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#161b26]/40 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">✓</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">The Grand Vision</span>
            </div>
            <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 border border-purple-500/20 rounded-full">Goal Completed</span>
          </div>
        </div>
      </section>

      {/* Pricing Plans Tiers */}
      <section id="pricing" className="relative z-10 px-6 lg:px-8 py-24 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-400">Pricing Plans</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2 uppercase">Choose the plan that fits your growth</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((p) => (
            <div 
              key={p.name} 
              className={`bg-[#161b26]/45 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full relative ${
                p.popular ? 'border-primary-500 shadow-xl shadow-primary-500/5' : 'border-white/5'
              }`}
            >
              {p.popular && (
                <span className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary-500">
                  Best Value
                </span>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-4xl font-black text-white">{p.price}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ mo</span>
                </div>
                <p className="text-xs text-slate-450 leading-relaxed mb-6 border-b border-white/5 pb-4">{p.desc}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register">
                <button className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  p.popular 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10' 
                    : 'bg-transparent border border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                  {p.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 lg:px-8 py-24 text-center border-t border-white/5">
        <div className="bg-gradient-to-b from-[#161b26]/50 to-[#101423]/50 border border-white/5 max-w-4xl mx-auto p-8 sm:p-14 shadow-2xl rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-white tracking-tight uppercase">Join 50,000+ high-performers optimizing their lives</h2>
          <p className="text-slate-450 mb-8 max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
            Stop switching tabs. Start mastering your existence with LifeOS.
          </p>
          <Link to="/register">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xl shadow-blue-500/10 transition-colors cursor-pointer inline-flex items-center gap-2">
              <span>Claim Your Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-white/5 py-10 bg-[#080c16]/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-white">LifeOS</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Customer Support</a>
            <a href="#" className="hover:text-slate-400">API Documentation</a>
            <a href="#" className="hover:text-slate-400">Community</a>
          </div>
          <p className="text-[10px] text-slate-650 font-medium">&copy; {new Date().getFullYear()} LifeOS Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
