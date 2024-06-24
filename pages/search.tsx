
import clsx from 'clsx';
import useSWR from 'swr'
import _ from 'lodash'
import { GetServerSideProps } from 'next'

import { useState } from 'react'
import { CssBaseline, Drawer } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { withStyles, WithStyles, createStyles } from '@mui/styles';

import Header, { ContentType } from '../components/search/Header'
import About from '../components/About'
import Journal from '../components/Journal'
import Plants from '../components/search/Plants'
import Filter from '../components/search/Filter'
import Location from '../components/search/loc/Location'
import AppContext from '../lib/contexts'
import Likes from '../components/search/Likes'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingPage from '../components/LoadingPage'
import withAuth from '../lib/withAuth'
import withGeo, { UIGeo } from '../lib/withGeo'
import { fetchers } from '../lib/apiFetchers'

const drawerWidth = 350;

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
  },
  contentShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
});

interface Props extends WithStyles<typeof styles> {
  geo: UIGeo
  category?: string
  token: string
}

function Search(props: Props) {
  const classes = props.classes
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth())
  const [category, setCategory] = useState(_.isNil(props.category) ? 'any' : props.category)
  const [contentType, setContentType] = useState<ContentType>(ContentType.Seed)


  const geo = props.geo
  const { data: tempZone } = useSWR(
    () => [geo.geo, 'temperature', props.token], 
    ([geo, about, token]) => fetchers.zone(geo, about, token)
  )
  if (_.isNil(tempZone)) {
    return <LoadingPage />
  }

  let mainContent = <></>
  switch (contentType) {
    case ContentType.Like:
      mainContent = <Likes />
      break
    case ContentType.About:
      mainContent = <About />
      break
    case ContentType.Journal:
      mainContent = <Journal />
      break
    default:
      mainContent = <>
        <Filter
          month={month} onMonthChange={(m: number) => setMonth(m)}
          category={category} onCategoryChange={(c: string) => setCategory(c)}
        />
        <Plants
          tempZone={tempZone}
          month={month}
          category={category}
        />
      </>
      break
  }

  return <>
    <CssBaseline />
    <AppContext.Provider value={{
      token: props.token,
      addr: geo.addr,
      geo: geo.geo,
      tempZone: tempZone,
    }}>
      <ErrorBoundary>
        <Header
          onLocationClick={() => setOpen(!open)}
          onContentChanged={(t: ContentType) => setContentType(t)} />
      </ErrorBoundary>

      <ErrorBoundary>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />

          {mainContent}
        </main>
      </ErrorBoundary>

      <ErrorBoundary>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader} />
          <Location />
        </Drawer>
      </ErrorBoundary>
    </AppContext.Provider>
  </>
}

export const getServerSideProps: GetServerSideProps = async ({ query: { id, latlon, category } }) => {
  return {
    props: {
      placeId: _.isNil(id) ? null : id,
      latlon: _.isNil(latlon) ? null : latlon,
      category: _.isNil(category) ? null : category,
    },
  }
}

export default withStyles(styles)(withGeo(withAuth(Search)))