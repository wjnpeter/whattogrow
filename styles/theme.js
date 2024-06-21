import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
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