import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/reflection', { replace: true });
  }, [navigate]);

  return <p>Signing you in...</p>;
}
