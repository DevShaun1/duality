import { useNavigate } from 'react-router-dom';

import FullScreenLoader from '@/components/common/FullScreenLoader';
import ProfileForm from '@/features/profile/components/ProfileForm';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';

export default function Profile() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useGetProfile();

  if (isLoading) return <FullScreenLoader />;

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Your profile</h1>
          <p className="text-muted-foreground">
            Something went wrong while loading your profile. Please refresh and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="text-muted-foreground">
          Choose the name Duality should use when reflecting with you.
        </p>
      </div>

      <ProfileForm
        defaultDisplayName={profile?.display_name}
        onSaved={() => navigate('/reflection')}
      />
    </div>
  );
}
