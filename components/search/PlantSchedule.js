import clsx from 'clsx';

import {Avatar, Typography, Grid} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 325,
    height: 54,
    position: 'relative',
    flexWrap: 'nowrap'
  },
  marker: {
    height: '100%',
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: 'auto',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  label: {
    marginTop: theme.spacing(1),
  },
  labelDays: {
    position: 'relative',
    top: -7,
  },
  line: {
    position: 'absolute',
    height: 2,
    right: 50,
    left: 30,
    top: 14,
    backgroundColor: theme.palette.secondary.light,
  }

}));

export default function PlantSchedule({ sprout, maturity }) {
  const classes = useStyles();
  const sproutDays = sprout.length === 1 ? sprout[0] : sprout.join('~')
  const maturityDays = maturity.length === 1 ? maturity[0] : maturity.join('~')

  const hasMaturity = maturityDays.length > 0

  return <>
    <Grid container alignItems='center' className={classes.root} >
      <div className={classes.line} ></div>

      <Grid container item className={classes.marker}>
        <Avatar className={classes.avatar} alt="Sow" src='/images/icons/sow.svg' />
        <Typography variant='body2' className={classes.label}>SOW</Typography>
      </Grid>

      <Grid item className={clsx(classes.marker)} style={{flexGrow: hasMaturity ? 2 : 10}}>
        <Typography variant='caption' className={classes.labelDays}>
          {sproutDays + (!hasMaturity ? '(Days)' : '')}
          </Typography>
      </Grid>

      <Grid container item className={classes.marker}>
        <Avatar className={classes.avatar} alt="Sprout" src='/images/icons/sprout.svg' />
        <Typography variant='body2' className={classes.label}>SPROUT</Typography>
      </Grid>

      {hasMaturity &&
        <>
          <Grid container item className={clsx(classes.marker, classes.long, classes.labelDays)}>
            <Typography variant='caption'>{maturityDays}(Days)</Typography>
          </Grid>
          <Grid container item className={classes.marker}>
            <Avatar className={classes.avatar} alt="Maturity" src='/images/icons/maturity.svg' />
            <Typography variant='body2' className={classes.label}>MATURITY</Typography>
          </Grid>
        </>
      }
    </Grid>
  </>
}

