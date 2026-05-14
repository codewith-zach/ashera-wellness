/**
 * Mobile-first responsive design tokens.
 * Mantine breakpoints: xs=36em(576px), sm=48em(768px), md=62em(992px), lg=75em(1200px).
 *
 * Usage: pass these objects to Title's `fz` or `size` props.
 *   <Title fz={hero}>...
 */

export const hero = { base: 26, xs: 30, sm: 34, md: 40 } as const;
export const sectionTitle = { base: 22, xs: 24, sm: 28, md: 32 } as const;
export const cardTitle = { base: 18, sm: 20, md: 22 } as const;
export const numericDisplay = { base: 22, xs: 24, sm: 26, md: 28 } as const;
export const heroLineHeight = { base: 1.1, sm: 1.15 } as const;

/** Container padding presets — tighter on mobile to maximise content width */
export const pageContainer = {
  px: { base: 'sm', sm: 'md' },
  py: { base: 'md', sm: 'lg' },
} as const;
