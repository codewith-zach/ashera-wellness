import type { Metadata, Viewport } from 'next';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import { theme } from '@/theme';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { RegisterSW } from '@/components/pwa/RegisterSW';

export const metadata: Metadata = {
  title: 'Ashe Ra Wellness Journal',
  description:
    'A living, daily companion to the Ashe Ra wellness journal — written for your body, by you.',
  applicationName: 'Ashe Ra',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ashe Ra',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#7A9E7E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="cream-bg">
        <a href="#main-content" className="skip-nav">
          Skip to content
        </a>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <QueryProvider>
            <Notifications position="bottom-center" />
            <div id="main-content">{children}</div>
          </QueryProvider>
          <RegisterSW />
        </MantineProvider>
      </body>
    </html>
  );
}
