import React from 'react';
import { supabase } from '../../utils/supabaseClient';

const GoogleLoginButton = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'email https://www.googleapis.com/auth/calendar'
      }
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
