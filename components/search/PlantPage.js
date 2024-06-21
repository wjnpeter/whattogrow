import useSWR from 'swr'
import _ from 'lodash'
import qs from 'qs'

import { useContext } from 'react';
import { Container, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import Plant from './Plant'
import AppContext from '../../lib/contexts'
import { fetchers } from '../../lib/apiFetchers'

const loadingEl = () => {
  let skeletons = []
  for (let i = 0; i < 12; ++i) {
    skeletons.push(
      <Grid item key={i}>
        <Skeleton variant="rect" width={250} height={130} />
        <Skeleton width={250} />
        <Skeleton width={200} />
      </Grid>)
  }

  return (
    <Container>
      <Grid container justify='space-around' spacing={3}>
        {skeletons}
      </Grid>
    </Container>
  )
}

export default function PlantPage(props) {
  const appContext = useContext(AppContext)

  // : ApiSeedFilter
  const filter = {
    month: props.month,
    tempZone: props.tempZone,
    ids: props.ids,
    page: props.page,
  }

  const { data: plants } = useSWR([qs.stringify(filter), appContext.token], fetchers.seeds)

  if (_.isNil(plants)) return loadingEl()

  // filter
  let filteredPlants = plants.data
  if (props.category !== 'any') {
    filteredPlants = plants.data.filter(p => p.category === props.category)
  }

  return <>
    {
      filteredPlants && filteredPlants.map(plant => (
        <Plant key={plant.name} plant={plant} />
      ))
    }
  </>
}
