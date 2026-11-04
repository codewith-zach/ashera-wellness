import { redirect } from 'next/navigation';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { requireUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.onboardedAt) redirect('/dashboard');
  return <OnboardingWizard displayName={user.displayName ?? 'friend'} />;
}
