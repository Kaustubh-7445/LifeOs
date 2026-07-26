import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to LifeOS</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last updated: July 26, 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none glass-card p-6 sm:p-10 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Overview & Data Safety</h2>
            <p>
              LifeOS ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, store, process, and protect your information when you use the LifeOS web application, mobile app, and related services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, password hash, and OAuth profile identifiers (Google, Apple).</li>
              <li><strong>User Content:</strong> Tasks, daily habit logs, long-term goals, financial budgets, expenses, and knowledge bookmarks created by you.</li>
              <li><strong>Usage & Device Metrics:</strong> Anonymized interaction logs and device telemetry to ensure app stability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. How We Use Your Information</h2>
            <p>
              We use your data strictly to deliver your personal operating system features: generating dashboard analytics, providing AI productivity recommendations, syncing devices, and protecting your account security. We do not sell your personal data to third parties or advertising networks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Data Deletion & User Rights</h2>
            <p>
              Under Google Play Store policies and GDPR/CCPA regulations, you hold complete ownership of your data. You may request permanent account deletion at any time via <strong>Settings &gt; Danger Zone &gt; Delete Account</strong>. All associated tasks, habits, financial records, and AI logs will be immediately purged from our active databases.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Security & Encryption</h2>
            <p>
              All network transmissions are protected using TLS 1.3 encryption. Passwords and sensitive session tokens are securely hashed using bcrypt and SHA-256 cryptographic functions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Contact Us</h2>
            <p>
              If you have any privacy questions or requests regarding your data, please contact our support team at <a href="mailto:privacy@lifeos.app" className="text-primary-500 font-semibold underline">privacy@lifeos.app</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
