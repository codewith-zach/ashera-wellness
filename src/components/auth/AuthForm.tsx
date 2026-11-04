'use client';

import {
  Box,
  Button,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { MotionFade } from '@/components/animations/MotionFade';

interface Props {
  mode: 'login' | 'signup';
}

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === 'signup';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(isSignup ? '/api/auth/signup' : '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isSignup ? { displayName: name, email, password } : { email, password },
      ),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      onboarded?: boolean;
      error?: string;
    };
    setSubmitting(false);

    if (!res.ok) {
      notifications.show({
        color: 'rose',
        title: isSignup ? 'Could not create your account' : 'Could not sign you in',
        message: data.error ?? 'Please check your details and try again.',
      });
      return;
    }

    router.push(data.onboarded ? '/dashboard' : '/onboarding');
    router.refresh();
  }

  return (
    <MotionFade>
      <Paper
        radius="lg"
        p="xl"
        maw={440}
        w="100%"
        style={{
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid rgba(122,158,126,0.14)',
          boxShadow: '0 12px 60px rgba(122,158,126,0.18)',
        }}
      >
        <form onSubmit={submit}>
          <Stack gap="md">
            <Box ta="center" mb={4}>
              <Text fz={34} mb={2}>✿</Text>
              <Title
                order={1}
                ff="Playfair Display, serif"
                c="sage.7"
                fw={500}
                fz={30}
              >
                {isSignup ? 'Begin your journal' : 'Welcome back'}
              </Title>
              <Text c="sage.6" fz="sm" fs="italic" ff="Playfair Display, serif">
                {isSignup
                  ? 'A few quiet moments a day, gently kept.'
                  : 'Your journal is waiting patiently.'}
              </Text>
            </Box>

            {isSignup && (
              <TextInput
                label="Your name"
                placeholder="Amara"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                required
                maxLength={60}
              />
            )}
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />

            <Button
              type="submit"
              loading={submitting}
              variant="gradient"
              gradient={{ from: 'sage.5', to: 'sage.7', deg: 135 }}
              radius="xl"
              size="md"
              fullWidth
            >
              {isSignup ? 'Create my journal' : 'Sign in'}
            </Button>

            <Text ta="center" fz="sm" c="sage.6">
              {isSignup ? (
                <>
                  Already have a journal?{' '}
                  <Text
                    component={Link}
                    href="/login"
                    c="sage.7"
                    td="underline"
                    inherit
                  >
                    Sign in
                  </Text>
                </>
              ) : (
                <>
                  New here?{' '}
                  <Text
                    component={Link}
                    href="/signup"
                    c="sage.7"
                    td="underline"
                    inherit
                  >
                    Create your journal
                  </Text>
                </>
              )}
            </Text>
          </Stack>
        </form>
      </Paper>
    </MotionFade>
  );
}
