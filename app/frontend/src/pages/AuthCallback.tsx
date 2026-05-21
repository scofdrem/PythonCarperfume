import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../lib/auth';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      authApi.setToken(token);
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/auth/error?error=No+token+received', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-500">Signing in...</p>
    </div>
  );
}