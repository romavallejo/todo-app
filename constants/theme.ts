import { Platform } from 'react-native';

const blue700 = '#1A56DB';  
const blue100 = '#DBEAFE';   
const blue600 = '#2563EB';   

const green700 = '#16A34A';  
const green100 = '#DCFCE7';  

const red600   = '#DC2626'; 
const red100   = '#FEE2E2';  

const gray900  = '#111827';  
const gray500  = '#6B7280';  
const gray200  = '#E5E7EB';  
const gray100  = '#F3F4F6';
const grayBg   = '#F4F6F9';

export const Colors = {
  light: {
    background:      grayBg,
    surface:         '#FFFFFF',
    surfaceAlt:      gray100,

    text:            gray900,
    textSecondary:   gray500,

    tint:            blue700,
    tintPressed:     blue600,
    tintSubtle:      blue100,

    green:           green700,
    greenSubtle:     green100,
    red:             red600,
    redSubtle:       red100,

    border:          gray200,
    divider:         gray200,

    tintAlt:         gray200,
    icon:            gray500,
    tabIconDefault:  gray500,
    tabIconSelected: blue700,
  },
  dark: {
    background:      '#0F1117',
    surface:         '#1C1E26',
    surfaceAlt:      '#252830',

    text:            '#F0F2F5',
    textSecondary:   '#9BA1A6',

    tint:            '#60A5FA',
    tintPressed:     '#93C5FD',
    tintSubtle:      '#1E3A5F',

    green:           '#4ADE80',
    greenSubtle:     '#14532D',
    red:             '#F87171',
    redSubtle:       '#450A0A',

    border:          '#2D3139',
    divider:         '#2D3139',

    tintAlt:         '#2D3139',
    icon:            '#9BA1A6',
    tabIconDefault:  '#9BA1A6',
    tabIconSelected: '#60A5FA',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans:    'system-ui',
    serif:   'ui-serif',
    rounded: 'ui-rounded',
    mono:    'ui-monospace',
  },
  default: {
    sans:    'normal',
    serif:   'serif',
    rounded: 'normal',
    mono:    'monospace',
  },
  web: {
    sans:    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif:   "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono:    "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  full: 9999,
};

export const Shadow = {
  card: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     3,
  },
  modal: {
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius:  24,
    elevation:     8,
  },
};