import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    fontWeight: theme.typography.fontWeightBold
  },
}))

export default function Number(props) {
  const classes = useStyles();

  if (props.number == null) return <></>

  return <>
    <Typography variant="body1" className={classes.root}>
      {props.number}
      <span>
        {props.unit || ''}
      </span>
    </Typography>
  </>
}