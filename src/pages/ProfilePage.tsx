import { useNavigate } from 'react-router-dom';

import FullScreenLoader from '@/components/common/FullScreenLoader';
import { StatusState } from '@/components/common/StatusState';
import ProfileForm from '@/features/profile/components/ProfileForm';
import { useGetProfile } from '@/features/profile/hooks/useGetProfile';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/features/auth/hooks/useAuth';
import DeleteAccountCard from '@/features/profile/components/DeleteAccountCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, isLoading, isError } = useGetProfile();
  const { user } = useAuth();

  if (isLoading) return <FullScreenLoader />;

  if (isError) {
    return (
      <PageContainer>
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
    </PageContainer>
  );
}
