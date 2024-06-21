import _ from 'lodash'
import clsx from 'clsx'

import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Card, CardActionArea, CardActions, CardContent, CardMedia, Button, Typography, GridListTile, Box} from '@material-ui/core';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import PlantRate from './PlantRate'
import PlantSchedule from './PlantSchedule'
import PlantDetail from './PlantDetail'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(8)
  },
  card: {
    margin: theme.spacing(1)
  },
  media: {
    height: 200,
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',

  },
  cardTitle: {
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    color: theme.palette.common.white,
    width: '100%',
    padding: theme.spacing(1, 2),
    alignItems: 'center',
  },
  cardAction: {
    color: theme.palette.secondary.dark
  },
  overlay: {
    backgroundImage: 'linear-gradient(rgba(255,255,255,0), rgba(0,0,0,0.5))',
    position: 'absolute',
    bottom: 0,
    top: '65%',
    right: 0,
    left: 0,
  },
  more: {
    marginLeft: 'auto'
  }
}))

export default function Plant({ plant }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // init like state
  useEffect(() => {
    const likePlants = JSON.parse(localStorage.getItem(process.env.LIKE_LS_KEY))
    setLiked(likePlants && likePlants.includes(plant.id))
  }, [])

  const likeIcon = liked ? <FavoriteIcon /> : <FavoriteBorderIcon />

  const handleClickLike = (e) => {
    const newLiked = !liked

    let likePlants = JSON.parse(localStorage.getItem(process.env.LIKE_LS_KEY))
    if (likePlants === null) likePlants = []

    // if like then add to likePlants
    // else remove it from likePlants
    if (newLiked) likePlants.push(plant.id)
    else {
      const idx = likePlants.indexOf(plant.id);
      if (idx !== -1) likePlants.splice(idx, 1);
    }

    localStorage.setItem(process.env.LIKE_LS_KEY, JSON.stringify(likePlants));

    setLiked(newLiked);
    e.stopPropagation()
  };

  let thumb = plant.wiki && plant.wiki.thumbnail && plant.wiki.thumbnail.source
  if (thumb === undefined) {
    thumb = '/images/no-plant.jpg'
  }

  return (
    <>
      <GridListTile className={classes.root} key={plant.name} cols={1}>
        <Card className={classes.card}>
          <CardActionArea onClick={handleClickOpen}>
            <CardMedia
              className={classes.media}
              image={thumb}
            >
              <div className={classes.overlay}></div>

              <Box className={classes.cardTitle}>
                <Typography variant='h6'>{plant.name}</Typography>
                <PlantRate descript rate={plant.rate} />
              </Box>
            </CardMedia>
          </CardActionArea>
          <CardContent className={classes.content}>
            <PlantSchedule sprout={plant.germination} maturity={plant.maturity} />
          </CardContent>

          <CardActions disableSpacing >
            <Button
              variant="outlined"
              className={classes.cardAction}
              startIcon={likeIcon}
              onClick={handleClickLike}
            >
              Like
            </Button>
            <Button
              onClick={handleClickOpen}
              className={clsx(classes.cardAction, classes.more)}
            >
              More
            </Button>
          </CardActions>
        </Card>
      </GridListTile>

      <PlantDetail plant={plant} open={open} onClose={handleClose} />
    </>
  );
}
