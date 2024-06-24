
import { Typography, Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { withStyles, WithStyles, createStyles } from '@mui/styles';

import VLine from './VLine'
import Number from './Number'
import LocAvatar from './LocAvatar'

const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(9)
  },
  avatarWrap: {
    textAlign: 'center',
    alignItems: 'center',
    width: '56px',
    overflow: 'hidden'
  },
});

interface Props extends WithStyles<typeof styles> {
  icon: string
  number: string
  label: string
  unit: string
}

function AgriCard(props: Props) {
  return <>
    <Grid
      className={props.classes.root}
      container 
      wrap='nowrap' 
      alignItems='center' 
      spacing={4}>

      <Grid item className={props.classes.avatarWrap}>
        <LocAvatar src={props.icon} />
      </Grid>

      <Grid item>
        <VLine height={50} />
      </Grid>

      <Grid container item direction='column' alignItems='flex-start' style={{ width: 'auto' }}>
        <Number number={props.number} unit={props.unit} />
        <Typography variant="body1" children={props.label} />
      </Grid>
    </Grid>
  </>
}

export default withStyles(styles)(AgriCard)