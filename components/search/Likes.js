import qs from 'qs'

import { Container, Typography } from "@mui/material";
import { makeStyles } from '@mui/styles';

import Plants from "./Plants";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center'
  },
  title: {
    margin: theme.spacing(12, 'auto', 12)
  },
  subtitle: {
    marginBottom: theme.spacing(4)
  }
}));

const titleEl = (classes) => {
  return <Typography className={classes.title} variant='h6'>My Plants Collection</Typography>
}

const noLikesContent = (classes) => {
  return <>
    <Typography>
      Seems like you haven't like anything yet.
      Just hit the "Like" button on any plant and come back here to see your personal collection.
    </Typography>
  </>
}

export default function Likes() {
  const classes = useStyles();

  const likePlantIds = localStorage.getItem(process.env.LIKE_LS_KEY)
  const likePlants = JSON.parse(likePlantIds)
  
  let content = <></>
  if (_.isEmpty(likePlants)) content = noLikesContent(classes)
  else {
    content = <>
      <Typography className={classes.subtitle}>Your Liked {likePlants.length} Plants</Typography>
      <Plants category='any' ids={likePlants} />
    </>
  }

  return <Container className={classes.root}>
    {titleEl(classes)}
    {content}
  </Container>
}