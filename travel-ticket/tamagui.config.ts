import { getDefaultTamaguiConfig } from '@tamagui/config-default';
import { createTamagui, createFont } from 'tamagui';
import { Platform } from 'react-native';

const { animations: _animations, ...config } = getDefaultTamaguiConfig();

const sizeScale = {
  1: 11,
  1.5: 12,
  2: 13,
  2.5: 14,
  3: 15,
  3.5: 16,
  4: 17,
  4.5: 18,
  5: 19,
  5.5: 20,
  6: 22,
  6.5: 24,
  7: 26,
  7.5: 28,
  8: 30,
  8.5: 32,
  9: 36,
  9.5: 40,
  10: 44,
  11: 48,
  12: 56,
  true: 15,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
};

const lineHeightScale = {
  1: 14,
  1.5: 15,
  2: 16,
  2.5: 18,
  3: 20,
  3.5: 22,
  4: 24,
  4.5: 26,
  5: 26,
  5.5: 28,
  6: 28,
  6.5: 30,
  7: 32,
  7.5: 34,
  8: 36,
  8.5: 38,
  9: 42,
  9.5: 46,
  10: 50,
  11: 54,
  12: 64,
  true: 20,
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
};

const appFont = createFont({
  family: Platform.OS === 'web' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' : 'System',
  size: sizeScale,
  lineHeight: lineHeightScale,
  weight: {
    1: '400',
    4: '400',
    6: '600',
    7: '700',
    8: '800',
    9: '900',
    true: '400',
  },
  letterSpacing: {
    1: 0,
    4: 0,
    true: 0,
  },
});

export const tamaguiConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      blue10: '#0066FF',
      gray3: '#F1F5F9',
      gray5: '#E2E8F0',
      gray10: '#64748B',
      gray11: '#475569',
    },
    radius: {
      ...config.tokens.radius,
      0: 0,
      xs: 4,
      sm: 6,
      md: 9,
      lg: 12,
      xl: 16,
      true: 9,
    },
    space: {
      ...config.tokens.space,
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      true: 12,
    },
    size: {
      ...config.tokens.size,
      xs: 28,
      sm: 36,
      md: 44,
      lg: 52,
      xl: 60,
      true: 44,
    },
  },
  fonts: {
    heading: appFont,
    body: appFont,
  },
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: '#F8FAFC',
      color: '#0F172A',
    },
    dark: {
      ...config.themes.dark,
      background: '#0B0F19',
      color: '#F8FAFC',
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module '@tamagui/web' {
  interface TamaguiCustomConfig extends Conf {}
  interface StackStyleBase {
    enterStyle?: any;
    exitStyle?: any;
    pressStyle?: any;
    hoverStyle?: any;
    focusStyle?: any;
    animation?: any;
  }
}

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
  interface StackStyleBase {
    enterStyle?: any;
    exitStyle?: any;
    pressStyle?: any;
    hoverStyle?: any;
    focusStyle?: any;
    animation?: any;
  }
}

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
