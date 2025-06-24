import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <div className="mb-4 text-green-700 flex items-center gap-4">
        Welcome, {user.email}!
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 bg-gray-300 hover:bg-gray-400 text-black rounded"
        >
          Logout
        </button>
      </div>
    );
  }
  return <GoogleLoginButton />;
};

export default AuthStatus; 