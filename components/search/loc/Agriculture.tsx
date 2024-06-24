
import useSWR from 'swr'
import axios from 'axios'
import { useContext } from 'react'
import { Container } from '@mui/material';

import AgriCard from './AgriCard'
import AppContext from '../../../lib/contexts'
import { fetchers } from '../../../lib/apiFetchers'

export default function Agriculture() {
  const appContext = useContext(AppContext)

  const token = appContext.token
  const geo = appContext.geo

  // Here's an assumption: 
  // The station from bomstn is the same as the 'list' from bomagri

  const agriData = (res: any) => res && res.data && res.data.agri

  const { data: stationTerrTemp } = useSWR(
    [geo, (124).toString(), token], 
    ([geo, product, token]) => fetchers.bomstn(geo, product, token)
  )
  const { data: agriTerrTemp } = useSWR(
    () => [geo, stationTerrTemp.data.station.id, token], 
    ([geo, station, token]) => fetchers.bomagri(geo, station, token)
  )
  const terrTemp = agriData(agriTerrTemp) ? agriData(agriTerrTemp).terrTemp : null

  const { data: stationSunshine } = useSWR(
    [geo, (133).toString(), token], 
    ([geo, product, token]) => fetchers.bomstn(geo, product, token)
  )
  const { data: agriSunshine } = useSWR(
    () => [geo, stationSunshine.data.station.id, token], 
    ([geo, station, token]) => fetchers.bomagri(geo, station, token)
  )
  const sunshine = agriData(agriSunshine) ? agriData(agriSunshine).sunshine : null

  const { data: stationEvaporation } = useSWR(
    [geo, (125).toString(), token], 
    ([geo, product, token]) => fetchers.bomstn(geo, product, token)
  )
  const { data: agriEvaporation } = useSWR(
    () => [geo, stationEvaporation.data.station.id, token], 
    ([geo, station, token]) => fetchers.bomagri(geo, station, token)
  )
  const evaporation = agriData(agriEvaporation) ? agriData(agriEvaporation).evaporation : null

  const precip = agriData(agriTerrTemp) ? agriData(agriTerrTemp).precip : null

  let cards = []
  if (terrTemp) {
    cards.push(
      <AgriCard
        key='terrTemp'
        icon='/images/icons/terrtmp.svg'
        number={terrTemp}
        label='Overnight Temperature'
        unit='°C'
      />
    )
  }

  if (precip) {
    cards.push(
      <AgriCard
        key='precip'
        icon='/images/icons/precip.svg'
        number={precip}
        label='Rainfall'
        unit='mm'
      />
    )
  }

  if (sunshine) {
    cards.push(
      <AgriCard
        key='sunshine'
        icon='/images/icons/sunshine.svg'
        number={sunshine}
        label='Sunshine Hours'
        unit='hours'
      />
    )
  }

  if (evaporation) {
    cards.push(
      <AgriCard
        key='Evaporation'
        icon='/images/icons/evaporation.svg'
        number={evaporation}
        unit='mm'
        label='Evaporation'
      />
    )
  }

  return <Container>
    {cards}
  </Container>
}
