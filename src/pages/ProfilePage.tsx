import { useNavigate } from 'react-router-dom';

import FullScreenLoader from '@/components/common/FullScreenLoader';
import { StatusState } from '@/components/common/StatusState';
import ProfileForm from '@/features/profile/components/ProfileForm';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import DeleteAccountCard from '@/features/profile/components/DeleteAccountCard';
import { Button } from '@/components/ui/button';
import { signOutAndRedirect } from '@/features/auth/utils/signOutAndRedirect';
import { devComponentAttrs } from '@/lib/devtools';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useGetProfile();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOutAndRedirect(navigate);
  };

  if (isLoading) return <FullScreenLoader />;

  if (isError) {
    return (
      <PageContainer {...devComponentAttrs('ProfilePage')}>
        <div className="mx-auto max-w-2xl">
          <StatusState
            title="We couldn’t load your profile"
            description="Please refresh and try again in a moment."
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Your profile"
        description="Choose the name Duality should use when reflecting with you."
      />

      <ProfileForm
        defaultDisplayName={profile?.display_name}
        signedInEmail={user?.email ?? ''}
        onSaved={() => navigate('/reflect')}
      />

      <DeleteAccountCard className="mt-10" />

      <div className="mt-6 flex justify-end">
        <Button type="button" variant="secondary" className="h-11 px-4" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </PageContainer>
  );
}
