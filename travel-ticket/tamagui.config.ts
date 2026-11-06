import { getDefaultTamaguiConfig } from '@tamagui/config-default';
import { createTamagui } from 'tamagui';

const config = getDefaultTamaguiConfig();

export const tamaguiConfig = createTamagui({
  ...config,
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
