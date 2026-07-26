import { useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useThemeStore } from '@/store';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            getNotDisplayedReason: () => string;
            isSkippedMoment: () => boolean;
            getSkippedReason: () => string;
          }) => void) => void;
        };
      };
    };
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

export default function GoogleLoginButton({ onSuccess, text = 'signin_with' }: GoogleLoginButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  const handleCallback = useCallback(
    (response: { credential: string }) => onSuccess(response.credential),
    [onSuccess]
  );

  useEffect(() => {
    if (!clientId || !ref.current) return;

    const init = () => {
      if (!window.google || !ref.current) return;
      
      // Initialize Google Identity Services for official accounts.google.com popup
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCallback });
      
      // Render official Google button
      ref.current.innerHTML = '';
      window.google.accounts.id.renderButton(ref.current, {
        theme: resolvedTheme === 'dark' ? 'filled_blue' : 'outline',
        size: 'large',
        width: ref.current.offsetWidth || 320,
        text,
      });

      // Prompt One Tap Google accounts selector popup
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('Google One Tap not displayed reason:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('Google One Tap skipped reason:', notification.getSkippedReason());
        }
      });
    };

    if (window.google) {
      init();
      return;
    }

    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', init);
      return () => existing.removeEventListener('load', init);
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
  }, [clientId, handleCallback, text, resolvedTheme]);

  const handleClickWithoutClientId = () => {
    toast.error('To log in with Google, please add VITE_GOOGLE_CLIENT_ID in client/.env for accounts.google.com OAuth');
  };

  if (!clientId) {
    return (
      <button
        type="button"
        onClick={handleClickWithoutClientId}
        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#0d111d] dark:hover:bg-[#101423] border border-slate-200 dark:border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5" />
        Google
      </button>
    );
  }

  return <div ref={ref} className="w-full flex justify-center min-h-[40px]" />;
}

