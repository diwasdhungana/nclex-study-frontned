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
    grace: [
      '#ffd4b3', // lightest
      '#ffc8a0',
      '#ffbb8c',
      '#ffad79',
      '#ffa166',
      '#ff914c', // 6th index (base shade)
      '#e67e44',
      '#cc6d3d',
      '#b35d36',
      '#994f30', // darkest
    ],
  },
  primaryColor: 'grace',
});
