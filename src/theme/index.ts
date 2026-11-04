import { createTheme, MantineColorsTuple } from '@mantine/core';

const sage: MantineColorsTuple = [
  '#f0f7f1',
  '#dde9de',
  '#b5ceb8',
  '#8db99f',
  '#7a9e7e',
  '#5f8b66',
  '#4a7050',
  '#3a5a3f',
  '#2a432e',
  '#1a2c1d',
];

const blush: MantineColorsTuple = [
  '#fdf0ec',
  '#f5ddd5',
  '#e8c4b8',
  '#d9a898',
  '#c98c7c',
  '#b97060',
  '#a55450',
  '#8a3d3a',
  '#6e2929',
  '#521616',
];

const gold: MantineColorsTuple = [
  '#fdf6e8',
  '#f7e9c8',
  '#efd4a0',
  '#e6be78',
  '#c9a96e',
  '#b0905a',
  '#967748',
  '#7a5c38',
  '#5e4228',
  '#422c18',
];

const lavender: MantineColorsTuple = [
  '#f4f2fa',
  '#e5e1f5',
  '#cac4e8',
  '#ada4d8',
  '#b8aed4',
  '#9a91c0',
  '#7d74ab',
  '#615895',
  '#463e7a',
  '#2c2560',
];

const rose: MantineColorsTuple = [
  '#fdecea',
  '#f5cfca',
  '#ecb1aa',
  '#e3938a',
  '#d4827a',
  '#c0695f',
  '#a45049',
  '#883a35',
  '#6c2722',
  '#501612',
];

export const theme = createTheme({
  fontFamily: 'DM Sans, system-ui, -apple-system, sans-serif',
  fontFamilyMonospace: 'JetBrains Mono, ui-monospace, monospace',
  headings: {
    fontFamily: 'Playfair Display, Georgia, serif',
    fontWeight: '500',
  },
  primaryColor: 'sage',
  primaryShade: { light: 4, dark: 5 },
  defaultRadius: 'md',
  white: '#F5F0EA',
  colors: {
    sage,
    blush,
    gold,
    lavender,
    rose,
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '28px',
  },
  shadows: {
    xs: '0 1px 2px rgba(74,112,80,0.05)',
    sm: '0 1px 2px rgba(74,112,80,0.04), 0 6px 20px -10px rgba(74,112,80,0.14)',
    md: '0 2px 4px rgba(74,112,80,0.05), 0 12px 32px -12px rgba(74,112,80,0.20)',
    lg: '0 2px 6px rgba(74,112,80,0.06), 0 20px 48px -16px rgba(74,112,80,0.26)',
    xl: '0 4px 8px rgba(74,112,80,0.07), 0 28px 70px -20px rgba(74,112,80,0.32)',
  },
  components: {
    Button: { defaultProps: { radius: 'xl' } },
    Card: { defaultProps: { radius: 'lg', shadow: 'sm' } },
    Badge: { defaultProps: { radius: 'xl' } },
    TextInput: { defaultProps: { radius: 'md' } },
    Textarea: { defaultProps: { radius: 'md' } },
    NumberInput: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md' } },
  },
  other: {
    shadowSage: '0 4px 20px rgba(122,158,126,0.15)',
    gradientHero: 'linear-gradient(160deg, #7a9e7e 0%, #4a7050 100%)',
    cream: '#F5F0EA',
    creamSoft: '#FAF6F1',
    sageHex: '#7A9E7E',
    sageDarkHex: '#4A7050',
    sageLightHex: '#B5CEB8',
    salePaleHex: '#DDE9DE',
    blushHex: '#E8C4B8',
    goldHex: '#C9A96E',
    lavenderHex: '#B8AED4',
    roseHex: '#D4827A',
  },
});
