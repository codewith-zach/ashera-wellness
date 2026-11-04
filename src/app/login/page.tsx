import { Center, Box } from '@mantine/core';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.onboardedAt ? '/dashboard' : '/onboarding');
  return (
    <Center mih="100vh" style={{ background: '#F5F0EA' }} px="md">
      <Box w="100%" style={{ display: 'flex', justifyContent: 'center' }}>
        <AuthForm mode="login" />
      </Box>
    </Center>
  );
}
