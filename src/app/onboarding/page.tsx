import { Center, Box } from '@mantine/core';
import { redirect } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { requireUser } from '@/lib/auth';
import { AmbientPetals } from '@/components/auth/AmbientPetals';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.onboardedAt) redirect('/dashboard');
  return (
    <Center mih="100vh" className="cream-bg" px="md" py="lg">
      <AmbientPetals count={8} />
      <Box w="100%" maw={640} style={{ display: 'flex', justifyContent: 'center' }}>
        <OnboardingWizard displayName={user.displayName ?? 'friend'} />
      </Box>
    </Center>
  );
}
