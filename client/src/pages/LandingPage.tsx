import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, CheckCircle, BarChart3, Target, Wallet,
  BookOpen, Brain, Zap, Shield, Check,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import logo from '@/assets/logo.png';

const features = [
  { icon: Target, title: 'Smart Planner', desc: 'Manage tasks with responsive Kanban boards, calendar layouts, and smart prioritization.' },
  { icon: Zap, title: 'Habit Tracker', desc: 'Build lasting routines, track daily completions, and visualize streak charts.' },
  { icon: BarChart3, title: 'Goal Planner', desc: 'Set fitness, career, financial, and learning goals with progressive milestones.' },
  { icon: Wallet, title: 'Expense Tracker', desc: 'Track incomes and expenses, establish budgets, and monitor savings trends.' },
  { icon: BookOpen, title: 'Learning Hub', desc: 'Keep courses, YouTube tutorials, and notes structured with active progress bars.' },
  { icon: Brain, title: 'AI Assistant', desc: 'Receive daily productivity suggestions and performance analysis via Gemini.' },
];

const stats = [
  { value: '8+', label: 'Integrated Modules' },
  { value: '100%', label: 'Local Encrypted Data' },
  { value: 'Gemini', label: 'AI Powered Insights' },
  { value: 'Unlimited', label: 'Life Management' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gray-950 text-slate-100 overflow-hidden font-sans selection:bg-primary-500/30">
      {/* Decorative blurred background lights */}
      <div className="absolute top-[-15%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-primary-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-purple-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] left-[45%] w-[40rem] h-[40rem] rounded-full bg-pink-600/5 blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950 to-gray-950 z-0 opacity-40 grid-bg" />

      {/* Floating Glassmorphic Navbar */}
      <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between shadow-lg shadow-black/10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="LifeOS Logo" className="w-9 h-9 object-contain rounded-xl" />
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              LifeOS
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-xs sm:text-sm px-2.5 py-1.5 sm:px-4 sm:py-2">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg shadow-primary-500/10 rounded-xl font-semibold transition-all text-xs sm:text-sm px-3.5 py-2 sm:px-5 sm:py-2.5">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 px-6 lg:px-8 pt-24 pb-20 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold mb-6 shadow-inner tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Your Ultimate Personal Command Center
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7.5xl font-black leading-tight tracking-tight mb-6 text-white">
            Supercharge Your Productivity With{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              LifeOS
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Tasks, habits, goals, finances, learning, and AI insights — integrated into a single, beautiful command center. Take control of your day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-xl shadow-primary-500/10">
                Start Free Account <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/10 text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Interactive Mock Dashboard Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 shadow-2xl shadow-primary-500/5 backdrop-blur-lg"
        >
          {/* Browser header visual */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-slate-900/40 rounded-t-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <div className="h-4 w-48 rounded bg-slate-800/40 mx-auto text-[10px] text-slate-500 flex items-center justify-center">
              lifeos.app/dashboard
            </div>
          </div>
          {/* Mock Dashboard Mockup Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left bg-slate-950/90 rounded-b-xl">
            {/* Widget 1: Productivity Score */}
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex flex-col justify-between h-36">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Productivity Score</p>
                <p className="text-3xl font-black mt-2 text-white bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">87%</p>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary-500 h-full rounded-full w-[87%]" />
              </div>
            </div>
            {/* Widget 2: Habits Completion */}
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex flex-col justify-between h-36">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Habit Completion</p>
                <div className="flex items-center gap-1.5 mt-2.5 text-emerald-400 font-bold text-sm">
                  <Check className="w-4 h-4" /> Routine Active
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 1, 1, 0, 1, 1, 1].map((c, i) => (
                  <span key={i} className={`flex-1 h-6 rounded-md ${c ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-slate-800/50'}`} />
                ))}
              </div>
            </div>
            {/* Widget 3: Expense Report */}
            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/30 flex flex-col justify-between h-36">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Monthly Savings</p>
                <p className="text-xl font-bold mt-1 text-white">$1,850.00</p>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[4, 6, 5, 8, 7, 9].map((h, i) => (
                  <span key={i} className="flex-1 bg-purple-500/20 border border-purple-500/30 rounded-t-md" style={{ height: `${h * 10}%` }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Stats Section */}
      <section className="relative z-10 px-6 lg:px-8 py-12 border-y border-white/5 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-white bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-10 px-6 lg:px-8 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Everything Unified In One Platform</h2>
          <p className="text-slate-400 mt-3 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
            Stop switching tabs. Manage your schedule, metrics, finances, and study logs in one visual ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="glass-card p-6 flex flex-col items-start hover:border-primary-500/35 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                <f.icon className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="relative z-10 px-6 lg:px-8 py-24 text-center">
        <div className="glass-card max-w-4xl mx-auto p-6 sm:p-12 relative overflow-hidden bg-gradient-to-b from-slate-900/60 to-slate-950/60 border border-white/10 shadow-2xl rounded-3xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />

          <Shield className="w-12 h-12 text-primary-400 mx-auto mb-5 shadow-inner" />
          <h2 className="text-3xl font-extrabold mb-4 text-white tracking-tight">Ready to Take Control?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Create your account today, verify your email, and instantly unlock a beautiful dashboard built to coordinate your life.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs sm:text-sm text-slate-300">
            {['No credit card required', 'Email verification code', 'Advanced AI features'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" /> {t}
              </span>
            ))}
          </div>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-xl shadow-primary-500/15">
              Get Started for Free <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} LifeOS. Built with modern full-stack developer tools.</p>
      </footer>
    </div>
  );
}
