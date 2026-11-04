'use client';

import {
  AppShell,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  History,
  Home,
  LogOut,
  Moon,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Sun,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { StreakBadge } from './StreakBadge';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  coachOnly?: boolean;
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/journal', label: "Today's Journal", icon: BookOpen },
  { href: '/insights', label: 'Insights', icon: Sparkles },
  { href: '/history', label: 'History', icon: History },
  { href: '/monthly', label: 'Monthly Setup', icon: CalendarDays },
  { href: '/weekly', label: 'Weekly Review', icon: CalendarRange },
  { href: '/coach', label: 'Coach Dashboard', icon: Stethoscope, coachOnly: true },
  { href: '/admin', label: 'Admin', icon: ShieldCheck, adminOnly: true },
  { href: '/profile', label: 'Profile', icon: User },
];

export function AppShellClient({
  children,
  userRole = 'client',
}: {
  children: React.ReactNode;
  userRole?: string;
}) {
  const [opened, { toggle, close }] = useDisclosure();
  const pathname = usePathname();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const visibleNav = NAV.filter(
    (n) =>
      (!n.coachOnly || userRole === 'coach') &&
      (!n.adminOnly || userRole === 'admin'),
  );

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding={{ base: 'xs', sm: 'md' }}
    >
      <AppShell.Header className="app-header">
        <Group
          h="100%"
          px={{ base: 'sm', sm: 'md' }}
          justify="space-between"
          wrap="nowrap"
          gap="xs"
        >
          <Group gap={12} wrap="nowrap" style={{ minWidth: 0 }}>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="#4A7050"
              aria-label="Open navigation"
            />
            <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
              <span style={{ fontSize: 20, color: '#7A9E7E', lineHeight: 1 }}>✿</span>
              <Title
                order={4}
                ff="Playfair Display, serif"
                c="sage.7"
                fw={500}
                fz={{ base: 16, sm: 18 }}
                style={{ letterSpacing: '0.02em' }}
              >
                Ashera
              </Title>
            </Group>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <StreakBadge />
            <UnstyledButton
              onClick={toggleColorScheme}
              aria-label="Toggle evening mode"
              title={colorScheme === 'dark' ? 'Switch to daylight' : 'Switch to evening'}
              c="sage.6"
              style={{ padding: 6, borderRadius: 8, lineHeight: 0 }}
            >
              {colorScheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </UnstyledButton>
            <UnstyledButton
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
              c="sage.6"
              style={{ padding: 6, borderRadius: 8, lineHeight: 0 }}
            >
              <LogOut size={17} />
            </UnstyledButton>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="app-navbar">
        <ScrollArea h="100%" type="never" style={{ display: 'flex', flexDirection: 'column' }}>
          <Text
            fz="xs"
            c="sage.5"
            tt="uppercase"
            lts={3}
            fw={600}
            mb="xs"
            px="xs"
          >
            Your journal
          </Text>
          {visibleNav.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <NavLink
                key={href}
                component={Link}
                href={href}
                onClick={close}
                label={label}
                leftSection={<Icon size={18} />}
                active={active}
                variant="filled"
                color="sage"
                mb={6}
                styles={{
                  root: { borderRadius: 12, padding: '12px 14px', minHeight: 44 },
                  label: { fontSize: 14 },
                }}
              />
            );
          })}
          <Box mt="xl" p="md" className="nav-quote">
            <Text fz="sm" c="sage.8" fs="italic" ff="Playfair Display, serif" lh={1.5}>
              &ldquo;Small consistent care beats grand gestures.&rdquo;
            </Text>
          </Box>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
