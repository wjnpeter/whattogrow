import _ from 'lodash'

import React from 'react'
import { Grid, Typography, Box, WithStyles, createStyles } from '@material-ui/core';
import { withStyles, Theme } from '@material-ui/core/styles';

import SearchBarCollection, { ICollection } from './SearchBarCollection'


const styles = (theme: Theme) => createStyles({
  root: {
    ...theme.mixins.gutters(),
  }
});

interface Props extends WithStyles<typeof styles> {
  collections: ICollection[]
}

function SearchBarCollections(props: Props) {
  const classes = props.classes

  return <>
    <Box className={classes.root}>
      <Typography variant='body1' paragraph>
        Collections
      </Typography>
      <Grid container spacing={2}>
        {
          props.collections.map((c, i) => <SearchBarCollection key={i} collection={c} />)
        }
      </Grid>
    </Box>
  </>
}

export default withStyles(styles)(SearchBarCollections)
