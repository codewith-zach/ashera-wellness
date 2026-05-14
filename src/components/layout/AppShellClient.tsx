'use client';

import {
  AppShell,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  BookOpen,
  CalendarDays,
  CalendarRange,
  History,
  Home,
  Sparkles,
  Stethoscope,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StreakBadge } from './StreakBadge';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  coachOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/journal', label: "Today's Journal", icon: BookOpen },
  { href: '/insights', label: 'Insights', icon: Sparkles },
  { href: '/history', label: 'History', icon: History },
  { href: '/monthly', label: 'Monthly Setup', icon: CalendarDays },
  { href: '/weekly', label: 'Weekly Review', icon: CalendarRange },
  { href: '/coach', label: 'Coach Dashboard', icon: Stethoscope, coachOnly: true },
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
  const visibleNav = NAV.filter((n) => !n.coachOnly || userRole === 'coach');

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
      <AppShell.Header
        style={{
          background: 'rgba(245,240,234,0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(122,158,126,0.15)',
        }}
      >
        <Group
          h="100%"
          px={{ base: 'sm', sm: 'md' }}
          justify="space-between"
          wrap="nowrap"
          gap="xs"
        >
          <Group gap={{ base: 6, sm: 12 }} wrap="nowrap" style={{ minWidth: 0 }}>
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
          <StreakBadge />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          background: '#FAF6F1',
          borderRight: '1px solid rgba(122,158,126,0.12)',
        }}
      >
        <ScrollArea h="100%" type="never">
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
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
