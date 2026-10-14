// Design tokens from the Hourglass design system (Aurum theme).
// Source of truth: Figma "Design system" frame (file cL1O7hS5b9d5kBIpoXLmuW, node 413:1856).

const colors = {
  light: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surface2: '#F4F3EF',
    text: '#17233C',
    dim: '#8C8C94',
    border: '#ECEAE2',
    gold: '#BE9A44',
    goldDeep: '#977829',
    goldSoft: '#E6D4A4',
    navy: '#1E3061',
    navySoft: '#EBEFF8',
    onNavy: '#FFFFFF', // text on navy fills; not in Figma, picked for contrast
  },
  dark: {
    bg: '#0E1424',
    surface: '#161E32',
    surface2: '#1E2740',
    text: '#EEF1F7',
    dim: '#9AA3B5',
    border: '#27314C',
    gold: '#D8B65A',
    goldDeep: '#BE9A44',
    goldSoft: '#5A4E2C',
    navy: '#9DB4E8',
    navySoft: '#1B2540',
    onNavy: '#0E1424',
  },
} as const;

// Hanken Grotesk ships one family per weight, so a weight maps to a family name.
const fonts = {
  light: 'HankenGrotesk_300Light',
  regular: 'HankenGrotesk_400Regular',
  medium: 'HankenGrotesk_500Medium',
  semibold: 'HankenGrotesk_600SemiBold',
  bold: 'HankenGrotesk_700Bold',
} as const;

// letterSpacing is in px: the design's em tracking multiplied by the font size.
const type = {
  display: { fontFamily: fonts.bold, fontSize: 40, letterSpacing: -1.2 },
  screenTitle: { fontFamily: fonts.bold, fontSize: 32, letterSpacing: -0.8 },
  pageTitle: { fontFamily: fonts.bold, fontSize: 30, letterSpacing: -0.6, lineHeight: 34.5 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 27, letterSpacing: -0.54 },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 19, letterSpacing: -0.19 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 17, letterSpacing: -0.17 },
  emphasis: { fontFamily: fonts.semibold, fontSize: 16 },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 25.6 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 24 },
  lead: { fontFamily: fonts.regular, fontSize: 15 },
  small: { fontFamily: fonts.regular, fontSize: 14 },
  fine: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 19.38 },
  button: { fontFamily: fonts.semibold, fontSize: 15 },
  label: { fontFamily: fonts.medium, fontSize: 13 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 12.5, letterSpacing: 0.75, textTransform: 'uppercase' },
  caption: { fontFamily: fonts.regular, fontSize: 12 },
  tabLabel: { fontFamily: fonts.medium, fontSize: 10.5 },
} as const;

const radius = {
  card: 26,
  button: 16,
  sheet: 30,
  pill: 999,
} as const;

// Cards use a hairline border and no shadow. Shadows only on the pill nav, FAB and sheets.
// Values are React Native `boxShadow` strings.
const shadow = {
  pill: '0px 14px 34px -14px rgba(20, 30, 60, 0.30)',
  fab: '0px 12px 26px -10px rgba(20, 30, 60, 0.45)',
  sheet: '0px -16px 50px 0px rgba(0, 0, 0, 0.28)',
  logo: '0px 22px 46px -18px rgba(20, 30, 60, 0.50)',
} as const;

// Logo colors are fixed and don't change with the theme.
const brand = {
  ink: '#16223C', // logo tile
  gold: '#C9A24A', // mark on the design-system logo (hourglass-mark.svg)
  mark: '#BE9A44', // mark on the splash tile and app icon (hourglass-mark-splash.svg)
} as const;

const spacing = {
  screenX: 22,
  listGap: 11,
  cardPadding: 16,
  minTapTarget: 44,
} as const;

export { colors, fonts, type, radius, shadow, brand, spacing };
export type ColorScheme = keyof typeof colors;
export type Colors = (typeof colors)[ColorScheme];
export type TypeVariant = keyof typeof type;
