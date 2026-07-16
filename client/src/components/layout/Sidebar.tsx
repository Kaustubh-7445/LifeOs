import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Target, Wallet, BookOpen, BarChart3,
  Settings, User, LogOut, ChevronLeft, Sparkles, Menu, X,
} from 'lucide-react';
import { useAuthStore, useSidebarStore } from '@/store';
import { authApi } from '@/services';
import { cn, getInitials } from '@/utils';
import toast from 'react-hot-toast';
import logo from '@/assets/logo.png';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/planner', icon: Calendar, label: 'Planner' },
  { to: '/habits', icon: Target, label: 'Habits' },
  { to: '/goals', icon: Sparkles, label: 'Goals' },
  { to: '/expenses', icon: Wallet, label: 'Expenses' },
  { to: '/learning', icon: BookOpen, label: 'Learning' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/profile', icon: User, label: 'Profile' },
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
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md shadow-primary-500/20 scale-[1.02]'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
        )
      }
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </NavLink>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full flex flex-col',
          'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-800/50',
          'transition-all duration-300',
          isCollapsed ? 'w-[72px]' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="LifeOS Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="font-bold text-lg bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                LifeOS
              </span>
            </div>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')} />
          </button>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {user && !isCollapsed && (
            <div className="flex items-center gap-3 p-3 mt-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton() {
  const { toggle } = useSidebarStore();
  return (
    <button onClick={toggle} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Open menu">
      <Menu className="w-5 h-5" />
    </button>
  );
}
