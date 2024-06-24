import _ from 'lodash'

import { Select, InputLabel, MenuItem, FormControl, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { monthNames } from '../../lib/utils'
import { ApiCategories } from '../../lib/api/interfaces'

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
  formControl: {
    minWidth: 180,
    margin: theme.spacing(2, 8)
  }
}))

export default function Filter(props) {
  const classes = useStyles();

  return <Container className={classes.root}>
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id='filter-label-sow-month'>Sow in</InputLabel>
      <Select
        labelId="filter-label-sow-month"
        id="filter-select-sow-month"
        value={props.month}
        onChange={(e) => props.onMonthChange(e.target.value)}
        label='Sow in'
      >
        {monthNames.map((m, i) => <MenuItem key={i} value={i}>{m}</MenuItem>)}
      </Select>
    </FormControl>

    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel shrink id='filter-label-category'>Category</InputLabel>
      <Select
        labelId="filter-label-category"
        id="filter-select-category"
        value={props.category}
        onChange={(e) => props.onCategoryChange(e.target.value)}
        label='Category'
        displayEmpty
      >
        <MenuItem key='any' value='any'>Any</MenuItem>
        {
          ApiCategories.map(c => {
            return <MenuItem key={c} value={c}>{_.capitalize(c)}</MenuItem>
          })
        }
      </Select>
    </FormControl>

  </Container>
}