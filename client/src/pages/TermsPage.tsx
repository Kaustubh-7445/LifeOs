import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Terms & Conditions</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last updated: July 26, 2026</p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none glass-card p-6 sm:p-10 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using LifeOS, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. User Account & Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account. You agree to notify us immediately of any unauthorized account access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Acceptable Use Policy</h2>
            <p>
              You agree not to use LifeOS for illegal activities, transmitting malicious code, attempting unauthorized server access, or abusing AI recommendation services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Service Availability & Modification</h2>
            <p>
              We continually upgrade LifeOS to improve stability and introduce new capabilities. We reserve the right to modify or discontinue features with reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Limitation of Liability</h2>
            <p>
              LifeOS is provided "as is" without warranties of any kind. In no event shall LifeOS or its developers be liable for indirect, incidental, or consequential damages resulting from app usage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Contact Information</h2>
            <p>
              For legal inquiries regarding these Terms, please contact <a href="mailto:support@lifeos.app" className="text-primary-500 font-semibold underline">support@lifeos.app</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
