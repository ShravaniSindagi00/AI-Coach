import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import GoogleLoginButton from './GoogleLoginButton';

const AuthStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (user) {
    return <div className="mb-4 text-green-700">Welcome, {user.email}!</div>;
  }
  return <GoogleLoginButton />;
};

export default AuthStatus; 