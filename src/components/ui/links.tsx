'use client';

/**
 * Mantine components rendered as a Next.js Link. These live in a client
 * module because Mantine's `component` prop takes a component function,
 * which server components may no longer pass across the boundary under
 * React 19.
 */

import { Anchor, Button, Card, Text } from '@mantine/core';
import type { AnchorProps, ButtonProps, CardProps, TextProps } from '@mantine/core';
import Link from 'next/link';
import type { ReactNode } from 'react';

type Href = { href: string; children?: ReactNode };

export function LinkButton({ href, children, ...rest }: ButtonProps & Href) {
  return (
    <Button component={Link} href={href} {...rest}>
      {children}
    </Button>
  );
}

export function LinkAnchor({ href, children, ...rest }: AnchorProps & Href) {
  return (
    <Anchor component={Link} href={href} {...rest}>
      {children}
    </Anchor>
  );
}

export function LinkText({ href, children, ...rest }: TextProps & Href) {
  return (
    <Text component={Link} href={href} {...rest}>
      {children}
    </Text>
  );
}

export function LinkCard({ href, children, ...rest }: CardProps & Href) {
  return (
    <Card component={Link} href={href} {...rest}>
      {children}
    </Card>
  );
}
