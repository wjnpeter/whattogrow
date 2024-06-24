import { Typography, Container, Avatar, Box } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { withStyles, createStyles, WithStyles } from '@mui/styles';

const styles = (theme: Theme) => createStyles({
  root: {
    textAlign: 'center',
    padding: theme.spacing(4, 8)
  },
  avatar: {
    width: '14rem',
    height: '10rem',
    margin: theme.spacing(4, 'auto')
  },
  content: {
    textAlign: 'left'
  }

});

interface Props extends WithStyles<typeof styles> {

}

function About(props: Props) {
  return <>
    <Container className={props.classes.root} maxWidth='md'>
      <Avatar variant={'rounded'} src={'images/about.jpg'} className={props.classes.avatar} />
      <Typography variant='h6'>About Seed Hunt</Typography>
      <Container className={props.classes.content} maxWidth='sm'>
        <Typography variant='body1'>
          <br />
        Seed Hunt is a free, handy tool to plan your garden.<br />
          <br />
        Seed Hunt started as a personal small project built to gather useful information like historical climate, moon, weather, etc., etc. that related to planting.<br />
          <br />
        For any feedback, suggestions or partnership opportunities, reach out appstudio.pc@gmail.com.<br />
          <br />
        </Typography>
      </Container>
    </Container>

  </>
}

export default withStyles(styles)(About)