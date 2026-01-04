import { createTheme } from '@mantine/core';

import components from './overrides';

export const theme = createTheme({
  components,
  cursorType: 'pointer',
  fontFamily: 'Inter, sans-serif',
  breakpoints: {
    xs: '30em',
    sm: '40em',
    md: '48em',
    lg: '64em',
    xl: '80em',
    '2xl': '96em',
    '3xl': '120em',
    '4xl': '160em',
  },
  colors: {
    studycolor: [
      '#e9d5ff', // lightest
      '#d8b4fe',
      '#c084fc',
      '#a855f7',
      '#9333ea',
      '#7e22ce', // 6th index (base shade)
      '#6b21a8',
      '#581c87',
      '#4c1d95',
      '#3b0764', // darkest
    ],
  },
  primaryColor: 'studycolor',
});
