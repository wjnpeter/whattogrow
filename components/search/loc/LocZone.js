import useSWR from 'swr'
import axios from 'axios'

import { useContext } from 'react'
import Typography from '@material-ui/core/Typography';

import AppContext from '../../../lib/contexts'
import { fetchers } from '../../../lib/apiFetchers'



export default function LocZone() {
  const appContext = useContext(AppContext)

  const { data: koppen } = useSWR([appContext.geo, 'koppenmajor', appContext.token], fetchers.zone)

  const addr = appContext.addr
  if (!addr) return <></>

  const locality = addr.locality

  const state = addr && addr.state ? addr.state.short_name : ''
  const postcode = addr && addr.postcode ? addr.postcode.short_name : ''
  const tempZone = appContext.tempZone

  let zoneInfo = tempZone.descript
  if (koppen) {
    zoneInfo += '. ' + koppen.descript[0]
  }

  return <>
    <Typography variant="h6">
      {locality.short_name}
    </Typography>

    <Typography variant="body1" >{state + ' ' + postcode}</Typography>
    <Typography variant="body1">{zoneInfo}</Typography>


  </>
}