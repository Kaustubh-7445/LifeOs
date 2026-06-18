import { useState } from 'react';
import toast from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore, useThemeStore } from '@/store';
import { authApi } from '@/services';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <Header title="Settings" subtitle="Manage your preferences" />

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
            <label className="flex items-center justify-between">
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
      </div>
    </div>
  );
}
