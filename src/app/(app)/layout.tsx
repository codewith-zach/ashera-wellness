import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AppShellClient } from '@/components/layout/AppShellClient';

export const dynamic = 'force-dynamic';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user.onboardedAt) redirect('/onboarding');
  return <AppShellClient userRole={user.role}>{children}</AppShellClient>;
}
