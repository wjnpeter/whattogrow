import clsx from 'clsx'
import { useRouter } from 'next/router'
import _ from 'lodash'
import throttle from 'lodash/throttle';

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Grid, Container, Paper, TextField, Divider } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { withStyles, createStyles, WithStyles } from '@mui/styles';
import useAutocomplete from '@mui/lab/useAutocomplete';
import SearchIcon from '@mui/icons-material/Search';

import SearchBarCollections from './SearchBarCollections'
import SearBarOption from './SearchBarOption'
import { ApiCategories } from '../lib/api/interfaces'

const styles = (theme: Theme) => createStyles({
  root: {
    position: 'relative',
  },
  gridRightIcon: {
    width: theme.spacing(7),
    height: 'auto',
    color: theme.palette.primary.contrastText,
  },
  gridLeft: {
    flexGrow: 1
  },
  gridRight: {
    cursor: 'pointer',
    display: 'flex',
    backgroundColor: theme.palette.primary.dark,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
    margin: 'auto',

  },
  listboxWrap: {
    position: 'absolute',
    left: theme.spacing(3),
    right: theme.spacing(3),
    height: '50vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper
  },
  listbox: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    '& li[data-focus="true"]': {
      backgroundColor: theme.palette.grey[100],
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: theme.palette.grey[300],
    },
  },
  divider: {
    margin: theme.spacing(0, 0, 2)
  },
  textField: {
    width: '100%'
  },
  textFieldInput: {
    backgroundColor: theme.palette.background.default,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 0,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  },
  textFieldFocused: {
    opacity: '1 !important',
    width: '100% !important'
  },
  textFieldCompact: {
    opacity: 0,
    width: 0

  },

  // status when compact(in mobile)
  gridLeftOnTextFieldFocused: {
    position: 'relative',

  },
  gridLeftOnTextFieldBlur: {
    position: 'absolute',

  },
  gridRightOnTextFieldBlur: {
    backgroundColor: 'unset',

  },
  gridRightOnTextFieldFocused: {
    backgroundColor: theme.palette.primary.dark,

  }
});

interface Props extends WithStyles<typeof styles> {
  onInputFocusChanged?: (focused: boolean) => void
  compact?: boolean
}

let gService: google.maps.places.AutocompleteService | null = null
type GPrediction = google.maps.places.AutocompletePrediction

const makeCollections = () => {
  const cities = [
    {
      localDescript: 'Hobart',
      latlon: '-42.8821, 147.3272',
    },
    {
      localDescript: 'Melbourne',
      latlon: '-37.8136, 144.9631',
    },
    {
      localDescript: 'Sydney',
      latlon: '-33.8688, 151.2093',
    },
    {
      localDescript: 'Brisbane',
      latlon: '-27.470125, 153.021072',
    },
    {
      localDescript: 'Adelaide',
      latlon: '-34.9285, 138.6007',
    },
    {
      localDescript: 'Perth',
      latlon: '-31.9505, 115.8605',
    }
  ]

  const randomCities = _.sampleSize(cities, 4)

  return randomCities.map((city) => {
    return {
      ...city,
      category: _.sample(ApiCategories) as string
    }
  })
}

function SearchBar(props: Props) {
  const [options, setOptions] = useState<GPrediction[]>([]);
  const [inputBlur, setInputBlur] = useState(true)
  const inputEl = useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<GPrediction | null>(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter()
  const collections = useMemo(makeCollections, [])

  const classes = props.classes

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    inputValue,
    popupOpen,
    focused,
    groupedOptions,

  } = useAutocomplete<GPrediction>({
    options: options,
    clearOnBlur: false,
    value: value,
    openOnFocus: true,
    open: open,
    getOptionLabel: (option) => {
      const structured = option.structured_formatting
      let ret = structured ? structured.main_text : option.description
      return ret ? ret : ''
    },
    getOptionSelected: (option, value) => {
      return option.id === value.id
    },
    onChange: (event: any, newValue: GPrediction) => {
      setValue(newValue)
      if (newValue) {
        router.push({
          pathname: '/search',
          query: { id: newValue.place_id }
        })
      }
    }
  });

  const fetchOptions = React.useMemo(
    () =>
      throttle((request: any, callback: (results?: GPrediction[]) => void) => {
        gService && gService.getPlacePredictions(request, callback);
      }, 200),
    [],
  );

  useEffect(() => {

    if (!gService && (window as any).google) {
      gService = new (window as any).google.maps.places.AutocompleteService();
    }
    if (!gService) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions([])
      return undefined
    }

    fetchOptions({
      input: inputValue,
      componentRestrictions: { country: 'au' },
      types: ['geocode']
    }, (results) => {
      setOptions(results || [])
    })

  }, [inputValue])

  const handleGridRightClick = () => {
    if (!inputEl.current) return
    inputEl.current!.focus()

    if (!_.isEmpty(options)) {
      router.push({
        pathname: '/search',
        query: {
          id: options[0].place_id
        }
      })
    }
  }

  return <>
    <Container {...getRootProps()} className={classes.root} >
      <Grid container >
        <Grid
          item
          className={clsx(classes.gridLeft, {
            [classes.gridLeftOnTextFieldFocused]: props.compact && !inputBlur,
            [classes.gridLeftOnTextFieldBlur]: props.compact && inputBlur,
          })}
        >
          <TextField
            inputRef={inputEl}
            variant="outlined"
            placeholder='City | Town | Address'
            {...getInputProps()}
            className={classes.textField}
            InputProps={{
              className: clsx(classes.textFieldInput, {
                [classes.textFieldCompact]: props.compact,
              }),
              classes: { focused: classes.textFieldFocused },
              onFocus: () => {
                setOpen(true)
                setInputBlur(false)
                props.onInputFocusChanged && props.onInputFocusChanged(true)
              },
              onBlur: () => {
                setOpen(false)
                setInputBlur(true)
                props.onInputFocusChanged && props.onInputFocusChanged(false)
              },
            }}
          />
        </Grid>

        <Grid
          item
          className={clsx(classes.gridRight, {
            [classes.gridRightOnTextFieldFocused]: props.compact && !inputBlur,
            [classes.gridRightOnTextFieldBlur]: props.compact && inputBlur,
          })}
          onClick={handleGridRightClick}>
          <SearchIcon className={classes.gridRightIcon} />
        </Grid>
      </Grid>

      {popupOpen && (
        <Container >
          <Paper elevation={12} className={classes.listboxWrap}>
            <ul className={classes.listbox} {...getListboxProps()}>
              {groupedOptions.map((option, index) => {
                return <li {...getOptionProps({ option, index })}><SearBarOption option={option} /></li>
              })}
            </ul>

            <Divider className={classes.divider} />

            <SearchBarCollections collections={collections} />

          </Paper>
        </Container>
      )}

    </Container>
  </>
}

export default withStyles(styles)(SearchBar)

