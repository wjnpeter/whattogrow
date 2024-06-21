import React from 'react';
import { Typography, CssBaseline, Container, Box, WithStyles, createStyles } from '@material-ui/core'
import { withStyles, Theme } from '@material-ui/core/styles';

import { monthNames } from '../lib/utils'
import Brand from '../components/Brand'
import ErrorBoundary from '../components/ErrorBoundary'
import SearchBar from '../components/SearchBar'
import withAuth from '../lib/withAuth'
import AppContext from '../lib/contexts'

const styles = (theme: Theme) => createStyles({
  header: {
    color: theme.palette.common.white,
    position: "fixed",
    top: "0px",
    left: "0px",
    right: "0px",
    ...theme.mixins.toolbar,
    ...theme.mixins.gutters(),
    alignItems: "center",
    zIndex: theme.zIndex.appBar,
  },
  root: {
    color: theme.palette.common.white,
    display: "flex",
    position: "absolute",
    bottom: "0",
    top: "0",
    right: "0",
    left: "0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,

    '&::before': {
      content: '""',
      position: "absolute",
      top: "0px",
      left: "0px",
      right: "0px",
      bottom: "0px",
      zIndex: "2",
      background:
        "linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%)," +
        "linear-gradient(rgba(0, 0, 0, 0.2) 0%, transparent 100%)"

    }
  },
  background: {
    position: "absolute",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  content: {
    width: "100%",
    zIndex: 3,
    position: 'absolute',
    top: '20%'
  },
  vedio: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  footer: {
    textAlign: 'center',
    color: theme.palette.grey['50'],
    position: 'fixed',
    bottom: theme.spacing(1),
  }
});

interface Props extends WithStyles<typeof styles> {
  token: string
}

const footerText = () => {
  const m = monthNames[new Date().getMonth()]

  let season = '' // Sep, Oct, Nov
  switch (m) {
    case 'Sep':
    case 'Oct':
    case 'Nov':
      season = 'Spring'
      break
    case 'Dec':
    case 'Jan':
    case 'Feb':
      season = 'Summer'
      break
    case 'Mar':
    case 'Apr':
    case 'May':
      season = 'Autumn'
      break
    case 'Jun':
    case 'Jul':
    case 'Aug':
      season = 'Winter'
      break
  }

  return m + '・' + season + '・' + new Date().getFullYear()
}

function Home(props: Props) {
  const classes = props.classes

  return <>
    <CssBaseline />
    <ErrorBoundary>
      <AppContext.Provider value={{
        token: props.token,
      }}>
        <Box className={classes.header} >
          <Brand />
        </Box>

        <Box className={classes.root} >
          <Box className={classes.background}>
            <video className={classes.vedio} autoPlay muted
              poster='/images/2461326-poster.jpg'>
              <source src="/images/2461326.mp4" type="video/mp4" />
            </video>
          </Box>

          <Container maxWidth='sm' classes={{ root: classes.content }}>
            <h1>Search a selection of plants suit my location, climate and timing.</h1>
            <SearchBar />
          </Container>

          <Container className={classes.footer}>
            <Typography variant='caption'>{footerText()}</Typography>
          </Container>
        </Box>
      </AppContext.Provider>
    </ErrorBoundary>
  </>
}

export default withStyles(styles)(withAuth(Home))