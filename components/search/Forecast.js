import React, { useState } from 'react'
import _ from 'lodash'
import { IconButton, Popover, Typography, ButtonBase, Box, Grid, Avatar, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import LoadingCircular from '../LoadingCircular'

const convert = (temp, isFaren) => {
  const ret = isFaren ? temp * 9 / 5 + 32 : temp
  return Math.round(ret)
}

const dailyWeather = (data, isFaren) => {
  const max = Math.round(convert(data.temperatureHigh, isFaren))
  const min = Math.round(convert(data.temperatureLow, isFaren))
  return <>
    <Avatar variant='square' src={iconSrc(data.icon)} />
    <Typography variant="body1">
      {max + ' | ' + min}
    </Typography>
    <Typography
      display='block'
      variant='body1'
      paragraph
      style={{ width: '100%' }}>
      {data.summary}
    </Typography>
  </>
}

const iconSrc = (i) => '/images/icons/weather/' + i + '.png'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  popover: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: 250,
    padding: theme.spacing(2, 4)
  },
  divider: {
    margin: theme.spacing(4, 6, 6)
  },
  unitSwitch: {
    position: 'absolute',
    top: theme.spacing(4),
    right: theme.spacing(4),
  },
  dimText: {
    color: theme.palette.text.disabled
  }
}));

export default function Forecast({ ds }) {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFaren, setFaren] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  if (_.isNil(ds)) {
    return <LoadingCircular />
  }

  const { icon: curIcon, apparentTemperature: cutTemp } = ds.currently
  const { data: forecast } = ds.daily

  const unit = isFaren ? '°F' : '°C'
  return <>
    <IconButton onClick={handleClick} color='inherit'>
      <Avatar className={classes.avatar} variant='square' src={iconSrc(curIcon)} />
      <Typography variant="body1">{convert(cutTemp, isFaren) + unit}</Typography>
    </IconButton>

    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{ className: classes.popover }}
    >
      <Grid container direction='column' spacing={2}>
        <Grid item>
          <Typography variant='h6'>TODAY</Typography>
        </Grid>
        <Grid item container justify='space-between'>
          {dailyWeather(forecast[0], isFaren)}
        </Grid>
      </Grid>
      <Divider className={classes.divider} />

      <Grid container direction='column' spacing={2}>
        <Grid item>
          <Typography variant='h6'>TOMORROW</Typography>
        </Grid>
        <Grid item container justify='space-between'>
          {dailyWeather(forecast[1], isFaren)}
        </Grid>
      </Grid>

      <ButtonBase className={classes.unitSwitch} onClick={() => setFaren(!isFaren)}>
        <Typography variant="caption" children='°C'
          className={isFaren ? classes.dimText : ''}>
        </Typography>
        {'/'}
        <Typography variant="caption" children='°F'
          className={isFaren ? '' : classes.dimText} >
        </Typography>
      </ButtonBase>
    </Popover>
  </>
}