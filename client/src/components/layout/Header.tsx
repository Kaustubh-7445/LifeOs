import { Moon, Sun, Search } from 'lucide-react';
import { useThemeStore } from '@/store';
import { MobileMenuButton } from './Sidebar';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  onOpenCommandPalette?: () => void;
}

export default function Header({ title, subtitle, action, onOpenCommandPalette }: HeaderProps) {
  const { resolvedTheme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <MobileMenuButton />
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              aria-label="Open command palette"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Search or command...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                ⌘K
              </kbd>
            </button>
          )}

          {action}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <NotificationsPanel />
        </div>
      </div>
    </header>
  );
}
