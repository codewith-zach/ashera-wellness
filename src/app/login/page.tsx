import { Center, Box } from '@mantine/core';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AuthForm } from '@/components/auth/AuthForm';
import { AmbientPetals } from '@/components/auth/AmbientPetals';

export const metadata = { title: { absolute: 'Sign in · Ashe Ra' } };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.onboardedAt ? '/dashboard' : '/onboarding');
  return (
    <Center mih="100vh" className="cream-bg" px="md">
      <AmbientPetals />
      <Box w="100%" style={{ display: 'flex', justifyContent: 'center' }}>
        <AuthForm mode="login" />
      </Box>
    </Center>
  );
}
