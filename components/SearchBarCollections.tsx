import _ from 'lodash'

import React from 'react'
import { Grid, Typography, Box, createStyles } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { withStyles, WithStyles } from '@mui/styles';

import SearchBarCollection, { ICollection } from './SearchBarCollection'


const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
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
