import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Target, Wallet, BookOpen, BarChart3,
  Settings, LogOut, ChevronLeft, Menu, X, Bot, HelpCircle,
} from 'lucide-react';
import { useAuthStore, useSidebarStore } from '@/store';
import { authApi } from '@/services';
import { cn } from '@/utils';
import toast from 'react-hot-toast';
import logo from '@/assets/logo.png';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/planner', icon: Calendar, label: 'Planner' },
  { to: '/expenses', icon: Wallet, label: 'Wealth' },
  { to: '/learning', icon: BookOpen, label: 'Knowledge' },
  { to: '/goals', icon: Bot, label: 'AI Coach' },
  { to: '/habits', icon: Target, label: 'Habits' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isOpen, isCollapsed, setOpen, toggleCollapse } = useSidebarStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // proceed with local logout
    }
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: typeof LayoutDashboard; label: string }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200',
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col',
          'bg-white dark:bg-[#111625] border-r border-slate-200 dark:border-white/5 shadow-xl transition-colors duration-250',
          'transition-all duration-300',
          isCollapsed ? 'w-[72px]' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/5">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="LifeOS Logo" className="w-7 h-7 object-contain rounded-lg" />
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                LifeOS
              </span>
            </div>
          )}
          {isCollapsed && (
            <img src={logo} alt="LifeOS Logo" className="w-7 h-7 object-contain rounded-lg mx-auto" />
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')} />
          </button>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-1.5">
          {user && !isCollapsed && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-transparent mb-3">
              <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-slate-200 dark:border-white/10">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces" 
                  alt={user.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">{user.name}</p>
                <p className="text-xs text-slate-555 dark:text-slate-400 truncate mt-0.5">Pro Plan</p>
              </div>
            </div>
          )}

          <div className="h-[1px] bg-slate-200 dark:bg-white/5 my-2" />

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
              )
            }
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>

          <button
            onClick={() => toast.success('Support center is active')}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-all text-left"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Support</span>}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-red-500/80 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton() {
  const { toggle } = useSidebarStore();
  return (
    <button onClick={toggle} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-650 dark:text-slate-400" aria-label="Open menu">
      <Menu className="w-5 h-5" />
    </button>
  );
}
