import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Calendar,
  Wallet,
  BookOpen,
  Bot,
  Target,
  BarChart3,
  Settings,
  User,
  PlusCircle,
  X,
} from 'lucide-react';
import { cn } from '@/utils';

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions';
  icon: typeof LayoutDashboard;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const commands: CommandItem[] = [
    { id: 'nav-dash', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, action: () => handleNavigate('/dashboard') },
    { id: 'nav-plan', title: 'Go to Planner', category: 'Navigation', icon: Calendar, action: () => handleNavigate('/planner') },
    { id: 'nav-exp', title: 'Go to Wealth & Expenses', category: 'Navigation', icon: Wallet, action: () => handleNavigate('/expenses') },
    { id: 'nav-learn', title: 'Go to Knowledge Hub', category: 'Navigation', icon: BookOpen, action: () => handleNavigate('/learning') },
    { id: 'nav-ai', title: 'Go to AI Coach', category: 'Navigation', icon: Bot, action: () => handleNavigate('/goals') },
    { id: 'nav-habits', title: 'Go to Habits Tracker', category: 'Navigation', icon: Target, action: () => handleNavigate('/habits') },
    { id: 'nav-analytics', title: 'Go to Analytics', category: 'Navigation', icon: BarChart3, action: () => handleNavigate('/analytics') },
    { id: 'nav-settings', title: 'Go to Settings', category: 'Navigation', icon: Settings, action: () => handleNavigate('/settings') },
    { id: 'nav-profile', title: 'Go to Profile', category: 'Navigation', icon: User, action: () => handleNavigate('/profile') },

    { id: 'act-task', title: 'Create New Task', category: 'Actions', icon: PlusCircle, action: () => handleNavigate('/planner') },
    { id: 'act-habit', title: 'Create New Habit', category: 'Actions', icon: PlusCircle, action: () => handleNavigate('/habits') },
    { id: 'act-exp', title: 'Add Expense Transaction', category: 'Actions', icon: PlusCircle, action: () => handleNavigate('/expenses') },
    { id: 'act-goal', title: 'Set New Goal', category: 'Actions', icon: PlusCircle, action: () => handleNavigate('/goals') },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent toggles state
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md transition-all duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#111625] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-white/10 py-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search... (Cmd+K)"
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white ml-2"
            aria-label="Close command palette"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                    isSelected
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cmd.title}</span>
                  </div>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-md font-medium',
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                    )}
                  >
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[10px]">
              ESC
            </kbd>{' '}
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
