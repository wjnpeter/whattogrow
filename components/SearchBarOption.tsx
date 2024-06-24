import parse from 'autosuggest-highlight/parse';
import _ from 'lodash'

import React, { useState, useRef, useEffect } from 'react'
import { Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles, useTheme } from '@mui/material/styles';
import { withStyles, WithStyles, createStyles } from '@mui/styles';

import SearchBarCollections from './SearchBarCollections'

const styles = (theme: Theme) => createStyles({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  }
});

interface Props extends WithStyles<typeof styles> {
  option: google.maps.places.AutocompletePrediction
}


function SearchBarOption(props: Props) {

  const theme = useTheme()
  const classes = props.classes

  const option = props.option

  let optionText = option.structured_formatting.main_text 
  if (option.structured_formatting.secondary_text) {
    optionText += ', ' + option.structured_formatting.secondary_text
  }
  
  const auIdx = optionText.lastIndexOf(', Australia')
  if (auIdx !== -1) {
    optionText = optionText.slice(0, auIdx)
  }

  const matches = option.structured_formatting.main_text_matched_substrings;

  const parts = parse(
    optionText,
    matches.map((match) => [match.offset, match.offset + match.length]),
  );

  return <>
    <Typography variant='body1' {...props} className={classes.root}>
      {
        parts.map((part, index) => {
          const fontWeight = part.highlight ? theme.typography.fontWeightBold : theme.typography.fontWeightBold
          const color = part.highlight ? theme.palette.common.black : theme.palette.text.hint
          return <span key={index} style={{ fontWeight, color }}>
            {part.text}
          </span>
        })
      }
    </Typography>
  </>
}

export default withStyles(styles)(SearchBarOption)

