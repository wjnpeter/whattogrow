import useSWR from 'swr'
import clsx from 'clsx'
import _ from 'lodash'
import NextLink from 'next/link'

import { useContext, useState } from 'react'
import {
  AppBar, Box, Toolbar, Typography, Button, IconButton,
  Menu, MenuItem, Divider, Theme
} from '@mui/material'
import { withStyles, WithStyles, createStyles } from '@mui/styles';
import MoreHoriz from '@mui/icons-material/MoreHoriz'
import Info from '@mui/icons-material/Info';

import AppContext from '../../lib/contexts'
import { fetchers } from '../../lib/apiFetchers'
import Forecast from './Forecast'
import Brand from '../Brand'
import SearchBar from '../SearchBar'
import Moon from './Moon'

const styles = (theme: Theme) => createStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end'
    }
  },
  location: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  locationInfoIcon: {
    fontSize: '0.625rem',
    verticalAlign: 'super',
  },
  menuPaper: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  mr3: {
    marginRight: theme.spacing(3),
  },
  xsDownMarginLeftAuto: {
    marginLeft: 'initial',

    [theme.breakpoints.down('xs')]: {
      marginLeft: 'auto',
    }
  },
  xsDownMenuItem: {
    display: 'none',

    [theme.breakpoints.down('xs')]: {
      display: 'flex'
    }
  },
  searchBar: {
    cursor: 'pointer',
    marginLeft: 'auto',

    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      width: '100%',
      top: 0,
      left: 0
    }
  },
  rightActions: {
    display: 'flex'
  },
  rightAction: {
    margin: 'auto'
  },
  standout: {
    zIndex: 1,
    width: '100%'
  }
});

interface Props extends WithStyles<typeof styles> {
  onLocationClick: () => void
  onContentChanged: (t: ContentType) => void
}

export enum ContentType {
  Seed, Like, Journal, About
}

function Header(props: Props) {
  const classes = props.classes
  const appContext = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchBarStandout, setSearchBarStandout] = useState(false)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleContentChanged = (ct: ContentType) => {
    setAnchorEl(null);
    props.onContentChanged(ct)
  }

  const handleInputFocusChanged = (focused: any) => {
    setSearchBarStandout(focused)
  }

  const addr = appContext.addr
  const town = addr && addr.locality ? addr.locality.short_name : ''

  return <AppBar
    position="fixed"
    className={classes.appBar}
  >
    <Toolbar className={classes.toolBar}>
      <Box sx={{ display: { xsDown: 'none' } }}>
        <Brand />
      </Box>

      <Box className={clsx(classes.searchBar, {
        [classes.standout]: searchBarStandout,
      })}>
        <SearchBar
          onInputFocusChanged={handleInputFocusChanged}
          compact
        />
      </Box>

      <Box className={classes.rightActions}>

        <Button
          color='secondary'
          onClick={props.onLocationClick}
          className={clsx(classes.location, classes.xsDownMarginLeftAuto)}>
          <Typography variant="body1" noWrap>
            {town}
            <Info className={classes.locationInfoIcon} />
          </Typography>
        </Button>

        {!_.isNil(appContext.geo) && <>
        {/* FIXME */}
          {/* <Box sx={{ display: { xs: 'none' } }} className={classes.rightAction}>
            <Forecast ds={dsRes} />
          </Box>

          <Box className={classes.rightAction}>
            <Moon ds={dsRes} />
          </Box> */}

          <IconButton color='inherit' aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            id="menu"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            classes={{ paper: classes.menuPaper }}
          >
            {/* <MenuItem key="Forecast" className={classes.xsDownMenuItem}>
              <Forecast ds={dsRes} />
            </MenuItem>
            <MenuItem key="Moon" className={classes.xsDownMenuItem}>
              <Moon ds={dsRes} />
            </MenuItem> */}

            <MenuItem key="Home" className={classes.xsDownMenuItem}>
              <NextLink href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                Home
              </NextLink>
            </MenuItem>

            <MenuItem key="Seeds" onClick={() => handleContentChanged(ContentType.Seed)}>
              Seeds
            </MenuItem>

            <MenuItem key="Likes" onClick={() => handleContentChanged(ContentType.Like)}>
              My Likes
            </MenuItem>

            <Divider />
            <MenuItem key="Journal" onClick={() => handleContentChanged(ContentType.Journal)}>
              Journal
            </MenuItem>

            <Divider />
            <MenuItem key="About" onClick={() => handleContentChanged(ContentType.About)}>
              About
            </MenuItem>

          </Menu>
        </>}

      </Box>
    </Toolbar>
  </AppBar >
}

export default withStyles(styles)(Header)