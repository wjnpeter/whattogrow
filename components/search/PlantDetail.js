import _ from 'lodash'

import React from 'react'
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Grid, Slide, Typography, Divider
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useContext } from 'react'
import CloseIcon from '@mui/icons-material/Close';

import PlantRate from './PlantRate'
import AppContext from '../../lib/contexts'
import { monthNames } from '../../lib/utils'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  divider: {
    margin: theme.spacing(0.5, 'auto', 1)
  },
  middle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  table: {
    marginBottom: theme.spacing(2),
    width: '80%'
  },
  img: {
    marginLeft: theme.spacing(1)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(2),
    color: theme.palette.grey[500],
  },
}));

const sowingMonth = (tempZone, plant) => {
  const month = plant.time['z' + tempZone.code]
  const increment = m => ++m % 12

  let ret = []
  let monthRange = null
  month.forEach((m, i) => {
    // m is [1, 12]
    const mIdx = m - 1

    if (monthRange === null) {
      monthRange = monthNames[mIdx]
      return
    }

    // if next element is not continously of current element,
    // then finish of current month range
    if (increment(mIdx) !== month[i + 1] - 1) {
      monthRange += '~' + monthNames[mIdx]
      ret.push(monthRange)
      monthRange = null
    }
  })

  return ret
}

export default function PlantDetail(props) {
  const classes = useStyles();
  const appContext = useContext(AppContext)

  const plant = props.plant

  const month = sowingMonth(appContext.tempZone, plant)
  const wikiThumb = plant.wiki && plant.wiki.thumbnail && plant.wiki.thumbnail.source

  return <>
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.onClose}
    >
      <DialogTitle className={classes.root}>
        <Grid spacing={3} container alignItems='center' justify='flex-start'>
          <Grid item>
            <Typography variant='h5'>{plant.name}</Typography>
            {/* <Typography variant='body1'>{plant.wiki && _.capitalize(plant.wiki.description)}</Typography> */}
          </Grid>
          <Grid item>
            <PlantRate rate={plant.rate} />
          </Grid>
        </Grid>
        <IconButton aria-label="close" className={classes.closeButton} onClick={props.onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.root}>

        {/* <Divider className={classes.divider} /> */}

        <Grid container className={classes.middle} alignItems='center' spacing={5}>
          <Grid item xs={8}>
            <Typography variant='h6'>Plan</Typography>
            <Divider className={classes.divider} />
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td><Typography variant='body1'>Sowing Month</Typography></td>
                  <td><Typography variant='body1'>{month.join(', ')}</Typography></td>
                </tr>
                <tr>
                  <td><Typography variant='body1'>Germination</Typography></td>
                  <td><Typography variant='body1'>{plant.germination.join('~')} Days</Typography></td>
                </tr>
                {!_.isEmpty(plant.maturity) && (
                  <tr>
                    <td><Typography variant='body1'>Maturity</Typography></td>
                    <td><Typography variant='body1'>{plant.maturity.join('~')} Days</Typography></td>
                  </tr>
                )}
              </tbody>
            </table>

            <Typography variant='h6'>Measure</Typography>
            <Divider className={classes.divider} />
            <table className={classes.table}>
              <tbody>
                <tr>
                  <td><Typography variant='body1'>Sowing Depth</Typography></td>
                  <td><Typography variant='body1'>{plant.depth.join('~')} mm</Typography></td>
                </tr>
                {plant.rowSpacing.length > 0 &&
                  <tr>
                    <td><Typography variant='body1'>Row Spacing</Typography></td>
                    <td><Typography variant='body1'>{plant.rowSpacing.join('~')} cm</Typography></td>
                  </tr>
                }
                <tr>
                  <td><Typography variant='body1'>Plant Spacing</Typography></td>
                  <td><Typography variant='body1'>{plant.spacing.join('~')} cm</Typography></td>
                </tr>
              </tbody>
            </table>

            <Typography variant='h6'>Care</Typography>
            <Divider className={classes.divider} />
            <Typography variant='body1'>Sow: {plant.sow.join(' or ')}</Typography>
            <Typography variant='body1'>Frost: {plant.frost}</Typography>
          </Grid>

          <Grid item xs={4}>
            {wikiThumb && <img width='100%' className={classes.img} src={wikiThumb} />}
          </Grid>
        </Grid>

        <section >
          <Typography variant='h6'>Wiki</Typography>
          <Divider className={classes.divider} />
          <Typography variant='body1'>{plant.wiki && plant.wiki.extract}</Typography>
        </section>
      </DialogContent>
    </Dialog>
  </>
}