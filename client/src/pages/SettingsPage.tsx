import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useAuthStore, useThemeStore } from '@/store';
import { authApi } from '@/services';
import { Trash2, Shield, FileText } from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    try {
      await authApi.updateProfile({
        preferences: {
          theme: newTheme,
          notifications: user?.preferences?.notifications ?? true,
          currency: user?.preferences?.currency ?? 'USD',
          timezone: user?.preferences?.timezone ?? 'UTC',
        },
      });
      if (user) setUser({ ...user, preferences: { ...user.preferences, theme: newTheme } });
    } catch {
      // theme still applied locally
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(passwords.current, passwords.new);
      toast.success('Password changed');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setIsDeleting(true);
    try {
      await authApi.deleteAccount();
      logout();
      toast.success('Account and associated data permanently deleted');
      navigate('/login');
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Header title="Settings" subtitle="Manage your preferences & account privacy" />

      <div className="p-4 lg:p-8 space-y-6 max-w-2xl">
        <Card title="Appearance">
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${theme === t ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Preferences">
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium">Enable notifications</span>
              <input
                type="checkbox"
                checked={user?.preferences?.notifications ?? true}
                onChange={async (e) => {
                  try {
                    const res = await authApi.updateProfile({
                      preferences: {
                        theme: user?.preferences?.theme ?? 'system',
                        notifications: e.target.checked,
                        currency: user?.preferences?.currency ?? 'USD',
                        timezone: user?.preferences?.timezone ?? 'UTC',
                      },
                    });
                    setUser(res.data.data.user);
                    toast.success('Notification preference updated');
                  } catch {
                    toast.error('Failed to update');
                  }
                }}
                className="w-4 h-4 rounded"
              />
            </label>
            <div>
              <label className="block text-sm font-medium mb-1.5">Currency</label>
              <select
                defaultValue={user?.preferences?.currency || 'USD'}
                onChange={async (e) => {
                  try {
                    const res = await authApi.updateProfile({
                      preferences: {
                        theme: user?.preferences?.theme ?? 'system',
                        notifications: user?.preferences?.notifications ?? true,
                        currency: e.target.value,
                        timezone: user?.preferences?.timezone ?? 'UTC',
                      },
                    });
                    setUser(res.data.data.user);
                    toast.success('Currency updated');
                  } catch {
                    toast.error('Failed to update');
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                {['USD', 'EUR', 'GBP', 'INR'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </Card>

        <Card title="Change Password">
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input label="Current Password" type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
            <Input label="New Password" type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
            <Input label="Confirm Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
            <Button type="submit" loading={loading}>Update Password</Button>
          </form>
        </Card>

        <Card title="Legal & Policy Information">
          <div className="space-y-3">
            <Link
              to="/privacy-policy"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Privacy Policy</span>
              </div>
              <span className="text-xs text-gray-400">View</span>
            </Link>
            <Link
              to="/terms"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Terms & Conditions</span>
              </div>
              <span className="text-xs text-gray-400">View</span>
            </Link>
          </div>
        </Card>

        <Card title="Danger Zone">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Delete Account & Data</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Permanently erase your account, tasks, habits, goals, expenses, and AI data. This operation is irreversible.
                </p>
              </div>
            </div>
            <Button
              variant="danger"
              onClick={() => {
                setDeleteConfirmText('');
                setShowDeleteModal(true);
              }}
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Permanently Delete Account?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This will permanently delete your account and remove all personal tasks, habits, goals, financial data, and AI analytics from our databases.
          </p>
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 font-medium">
            Type <strong className="font-bold">DELETE</strong> below to confirm account deletion.
          </div>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={isDeleting}
              disabled={deleteConfirmText !== 'DELETE'}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
