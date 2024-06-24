import { useRouter } from 'next/router'
import _ from 'lodash'
import useSWR from 'swr'
import qs from 'qs'

import React, { useState, useEffect, useContext } from 'react'
import {
  Grid, Typography, ButtonBase, Card, Divider, Avatar
} from '@mui/material'
import { Theme } from '@mui/material/styles';
import { withStyles, createStyles, WithStyles } from '@mui/styles';

import { fetchers } from '../lib/apiFetchers'
import { ApiSeedFilter } from '../lib/api/interfaces'
import AppContext from '../lib/contexts'


const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    height: '100%'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(4, 2)
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  textWrap: {
    textAlign: 'left'
  },
  text: {
    fontWeight: theme.typography.fontWeightBold
  },
  subText: {
    color: theme.palette.text.hint
  }
});


interface Props extends WithStyles<typeof styles> {
  collection: ICollection
}

function SearchBarCollection(props: Props) {
  const classes = props.classes
  const appContext = useContext(AppContext)
  const [total, setTotal] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const c = props.collection

  const { data: tempZone } = useSWR(
    [c.latlon, 'temperature', appContext.token], 
    ([geo, about, token]) => fetchers.zone(geo, about, token)
  )

  const filter: ApiSeedFilter = {
    month: new Date().getMonth(),
    tempZone: tempZone,
    category: c.category
  }

  const { data: plants } = useSWR(
    !_.isNil(tempZone) ? [qs.stringify(filter), appContext.token] : null, 
    ([filter, token]) => fetchers.seeds(filter, token)
  )
  
  useEffect(() => {
    if (plants) {
      setTotal(plants.plantTotal)
    }
  }, [plants])

  const handleClick = () => {
    setLoading(true)

    router.push({
      pathname: '/search',
      query: {
        latlon: c.latlon,
        category: c.category
      }
    })
  }
  
  if (!_.isNil(plants) && _.isEmpty(plants.data)) {
    return <></>
  }

  let imgSrc = null
  if (!_.isNil(plants) && !_.isEmpty(plants.data) && !_.isUndefined(plants.data[0].wiki.thumbnail)) {
    imgSrc = plants.data[0].wiki.thumbnail.source
  } else {
    imgSrc = 'images/category/' + c.category + '.jpg'
  }

  return <>
    <Grid item sm={6} xs={12} key={c.latlon}>
      <ButtonBase onClick={handleClick} className={classes.root}>
        <Card
          variant="outlined"
          className={classes.content}>
          <Grid container spacing={2} wrap='nowrap'>

            <Grid item className={classes.avatarWrap}>
              <Avatar src={imgSrc} variant="rounded" className={classes.avatar}/>
            </Grid>

            <Grid item container alignItems='flex-start' direction='column' className={classes.textWrap}>
              <Typography variant='body1' className={classes.text}>
                {_.capitalize(c.category) + 's in ' + c.localDescript}
              </Typography>
              {total && <Typography variant='body1' className={classes.subText}>{total} Plants</Typography>}

            </Grid>
          </Grid>
        </Card>
      </ButtonBase>
    </Grid>
  </>
}

export default withStyles(styles)(SearchBarCollection)

export interface ICollection {
  latlon: string,
  category: string,
  localDescript: string
}