import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/reflect', { replace: true });
  }, [navigate]);

  return <p>Signing you in...</p>;
}
