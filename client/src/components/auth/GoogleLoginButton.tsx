import { useEffect, useRef, useCallback } from 'react';
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
      
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCallback });
      
      // Render standard visible Google Button
      ref.current.innerHTML = '';
      window.google.accounts.id.renderButton(ref.current, {
        theme: resolvedTheme === 'dark' ? 'filled_blue' : 'outline',
        size: 'large',
        width: ref.current.offsetWidth || 320,
        text,
      });

      // Prompt One Tap real-time accounts selector
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap not displayed reason:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('One Tap skipped reason:', notification.getSkippedReason());
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

  if (!clientId) {
    return (
      <p className="text-xs text-center text-gray-400">
        Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in
      </p>
    );
  }

  return <div ref={ref} className="w-full flex justify-center min-h-[40px]" />;
}
