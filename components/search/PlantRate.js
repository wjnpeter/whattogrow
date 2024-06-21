
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle as fasCircle, faAdjust } from '@fortawesome/free-solid-svg-icons'
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons'

const descript = ['Very Easy', 'Easy', 'Average', 'Hard', 'Demanding']

const useStyles = makeStyles((theme) => ({
  rateZero: {
    color: theme.palette.secondary.light
  },
  rateOne: {
    color: theme.palette.secondary.main
  }
}));

const makeRate = (rate, classes) => {

  const score = Math.floor(rate)
  let half = rate % 1 !== 0

  let circles = []
  for (let i = 0; i < 5; ++i) {
    if (i < score) {
      circles.push(<FontAwesomeIcon key={i} className={classes.rateOne} icon={fasCircle} />)
    } else if (half) {
      circles.push(<FontAwesomeIcon key={i} className={classes.rateOne} icon={faAdjust} />)
      half = false
    } else {
      circles.push(<FontAwesomeIcon key={i} className={classes.rateZero} icon={farCircle} />)
    }
  }

  return circles
}

export default function PlantRate(props) {
  const classes = useStyles();

  const rate = props.rate

  return <div>
    {props.descript &&
      <Typography variant="caption" noWrap >
        {descript[Math.max(0, Math.floor(rate - 1))]}
      </Typography >}
    <Typography
      variant="h6"
      noWrap >
      {makeRate(rate, classes)}
    </Typography>

  </div>
}