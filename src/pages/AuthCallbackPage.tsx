import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusState } from '@/components/common/StatusState';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/reflect', { replace: true });
  }, [navigate]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <StatusState
        title="Signing you in"
        description="We’re finishing your secure connection and bringing you back to your reflections."
      />
    </div>
  );
}
