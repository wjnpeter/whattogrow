import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#415d43',
    },
    secondary: {
      main: '#c0db73',
    },
  },
  spacing: factor => `${0.25 * factor}rem`, // (Bootstrap strategy)
})