import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          state?: string;
          usePopup: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: {
            id_token: string;
            code: string;
          };
          user?: {
            name?: { firstName?: string; lastName?: string };
            email?: string;
          };
        }>;
      };
    };
  }
}

interface AppleLoginButtonProps {
  onSuccess: (email: string, name?: string) => void;
  onFallbackModal: () => void;
}

export default function AppleLoginButton({ onSuccess, onFallbackModal }: AppleLoginButtonProps) {
  const clientId = import.meta.env.VITE_APPLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const initApple = () => {
      if (!window.AppleID) return;
      try {
        window.AppleID.auth.init({
          clientId,
          scope: 'name email',
          redirectURI: window.location.origin,
          usePopup: true,
        });
      } catch (err) {
        console.error('Failed to init AppleID:', err);
      }
    };

    if (window.AppleID) {
      initApple();
      return;
    }

    const existing = document.querySelector('script[src*="appleauth"]');
    if (existing) {
      existing.addEventListener('load', initApple);
      return () => existing.removeEventListener('load', initApple);
    }

    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleauth/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = initApple;
    document.body.appendChild(script);
  }, [clientId]);

  const handleAppleClick = async () => {
    if (!clientId) {
      // Fallback if VITE_APPLE_CLIENT_ID is not configured
      onFallbackModal();
      return;
    }

    if (!window.AppleID) {
      toast.error('Apple Sign-In library loading, please try again.');
      return;
    }

    try {
      const res = await window.AppleID.auth.signIn();
      const userObj = res.user;
      let email = userObj?.email;
      let name = '';
      if (userObj?.name) {
        name = `${userObj.name.firstName || ''} ${userObj.name.lastName || ''}`.trim();
      }

      // If token payload exists, decode email if user object omitted (Apple hides email after 1st login)
      if (!email && res.authorization?.id_token) {
        try {
          const payload = JSON.parse(atob(res.authorization.id_token.split('.')[1]));
          email = payload.email;
        } catch {
          // ignore decode error
        }
      }

      if (email) {
        onSuccess(email, name || 'Apple User');
      } else {
        toast.error('Could not retrieve email from Apple Sign-In');
      }
    } catch (err: unknown) {
      const errorStr = (err as { error?: string })?.error;
      if (errorStr === 'popup_closed_by_user') {
        console.log('Apple login popup closed by user');
        return;
      }
      toast.error('Apple Sign-In failed');
    }
  };

  return (
    <button
      type="button"
      onClick={handleAppleClick}
      className="w-full py-2.5 bg-black hover:bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
    >
      <span className="text-sm shrink-0 leading-none"></span>
      Apple ID
    </button>
  );
}
