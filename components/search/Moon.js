import useSWR from 'swr'
import axios from 'axios'
import moment from 'moment'
import _ from 'lodash'

import { useState, useContext } from 'react'
import {
  Popover, Typography, IconButton, Grid, Avatar, List, ListItem, ListItemText, ListItemIcon,
  ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EcoIcon from '@material-ui/icons/Eco';
import CloseIcon from '@material-ui/icons/Close';

import { weekdayNames, moonActions } from '../../lib/utils'
import AppContext from '../../lib/contexts'
import LoadingCircular from '../LoadingCircular'
import { fetchers } from '../../lib/apiFetchers'


const useStyles = makeStyles((theme) => ({
  popover: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: 360,
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  title: {
    ...theme.mixins.gutters(),
    margin: theme.spacing(2, 'auto')

  },
  expansionPanel: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  expansionPanelSummary: {
    alignItems: 'center',
  },
  expansionPanelSummaryTitle: {
    minWidth: '65px'
  },
  expansionPanelSummaryDetail: {
    textTransform: 'capitalize',
    width: '100%'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const iconName = (phase) => {
  if (phase === 0) return 'new-moon'
  else if (phase < 0.25) return 'waxing-crescent'
  else if (phase === 0.25) return 'first-quarter'
  else if (phase < 0.5) return 'waxing-gibbous'
  else if (phase === 0.5) return 'full-moon'
  else if (phase < 0.75) return 'waning-gibbous'
  else if (phase === 0.75) return 'last-quarter'
  else if (phase < 1) return 'waning-crescent'

  return undefined
}
const iconFile = (phase) => 'images/icons/moon/' + iconName(phase) + '.png'

const fcDateDetailEl = (actions) => {
  const items = []

  actions.forEach(thing => {
    items.push(
      <ListItem key={thing} disableGutters dense>
        <ListItemIcon>
          <EcoIcon color="secondary" />
        </ListItemIcon>
        <ListItemText primary={thing} />
      </ListItem>
    )
  })

  return <List >
    {items}
  </List>
}

const fcDateEl = (fcData, moonNode, classes) => {
  const phase = fcData.moonPhase
  const day = moment.unix(fcData.time)

  return <ExpansionPanel key={fcData.time} className={classes.expansionPanel}>
    <ExpansionPanelSummary classes={{ content: classes.expansionPanelSummary }}>

      <Typography className={classes.expansionPanelSummaryTitle}>
        {day.isSame(moment(), 'day') ? 'Today' : weekdayNames[day.day()]}
      </Typography>

      <Grid container justify='center'>
        <Avatar variant='square' alt={iconName(phase)} src={iconFile(phase)} />
      </Grid>

      <Grid container direction='column' alignItems='flex-end'>
        <Typography className={classes.expansionPanelSummaryDetail} >{moonNode === undefined ? '' : moonNode}</Typography>
        <Typography className={classes.expansionPanelSummaryDetail} >{iconName(phase).replace('-', ' ')}</Typography>
      </Grid>


    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      {fcDateDetailEl(moonActions(phase))}
    </ExpansionPanelDetails>
  </ExpansionPanel>
}

export default function Moon({ ds }) {
  const classes = useStyles();
  const appContext = useContext(AppContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: moonNodes } = useSWR(() => [ds.daily.data.length, appContext.token], fetchers.moon)

  if (_.isNil(ds)) return <LoadingCircular />

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const { data: forecast } = ds.daily

  const todayMoonPhase = forecast[0].moonPhase

  const token = appContext.token

  return <>
    <IconButton aria-describedby={id} onClick={handleClick}>
      <Avatar className={classes.avatar} variant='square' alt={'todayMoonPhase'} src={iconFile(todayMoonPhase)} />
    </IconButton>

    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      PaperProps={{ className: classes.popover }}
    >
      <Typography className={classes.title} variant='h6' >Moon Forecast</Typography>

      {
        forecast.map((fcData, i) => {
          const moonNode = moonNodes && moonNodes[i] ? moonNodes[i] : undefined
          return fcDateEl(fcData, moonNode, classes)
        })
      }

      <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Popover>
  </>
}