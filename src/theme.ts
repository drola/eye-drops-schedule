import { createTheme, MantineColorsTuple } from '@mantine/core';

const paleBlue: MantineColorsTuple = [
  '#ecf4ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc0',
  '#5f7cb7',
  '#5474b4',
  '#44639f',
  '#3a5890',
  '#2c4b80',
];

export const theme = createTheme({
  colors: { paleBlue },
  primaryColor: 'paleBlue',
});
