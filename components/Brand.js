import NextLink from 'next/link';

import React from 'react';
import { Link, ButtonBase, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "'Gochi Hand', cursive",
    display: 'inline-block'
  }
}));

export default function Brand(props) {
  const classes = useStyles()

  return <>
    <NextLink href="/" >
      <a style={{textDecoration: 'none'}}>
        <Typography color='secondary' variant='h6' className={classes.title}>
          SeedHunt
        </Typography>
      </a>
    </NextLink>
  </>
}