import clsx from 'clsx';
import useSWR from 'swr'
import axios from 'axios'
import { useContext } from 'react'

import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

import Number from './Number'
import {soilDataType} from '../../../lib/utils'
import AppContext from '../../../lib/contexts'
import { fetchers } from '../../../lib/apiFetchers'


const useStyles = makeStyles((theme) => {
  const borderColor = theme.palette.primary.light
  return {
    table: {
    textAlign: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    width: '100%',
    margin: 'auto'
  },
  td: {
    height: 200,
    position: 'relative',
  },
  borderBottom: {
    borderBottom: '1px solid',
    borderBottomColor: borderColor,
  },
  borderRight: {
    borderRight: '3px solid',
    borderRightColor: borderColor
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '10px solid',
    borderTopColor: borderColor,
    position: 'absolute',
    bottom: -2,
    right: -9,
  },
  circle: {
    width: 7,
    height: 7,
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '50%',
    position: 'absolute',
    right: -5,
  }
}})

const makeTDDepth = (uiSoil, classes) => {

  const depths = uiSoil.map((us, i) => {
    return (<div key={us.d} style={{ height: us.h }}>
      <Typography variant="body1" children={us.d} />
      <div className={i === uiSoil.length - 1 ? classes.arrow : classes.circle} />
    </div>)
  })

  return depths
}

const makeTDTemp = (uiSoil) => {
  const temps = uiSoil.map((us, i) => {
    return (<div key={us.d} style={{ height: us.h }}>
      <Number number={us.v === null ? 'N/A' : us.v} />
    </div>)
  })

  return temps
}

const makeUiSoil = (agri) => {
  let uiSoil = [
    { h: '10%', d: '5cm', v: null },  // t5
    { h: '10%', d: '10cm', v: null }, // t10
    { h: '15%', d: '20cm', v: null }, // t20
    { h: '25%', d: '50cm', v: null }, // t50
    { h: '40%', d: '1m', v: null }, // t1m
  ]

  if (!agri) return uiSoil

  soilDataType.map((t, i) => uiSoil[i].v = (t in agri) ? agri[t] : null)

  return uiSoil
}

export default function Soil() {
  // FIXME: product 31 is not available
  const classes = useStyles()
  const appContext = useContext(AppContext)

  const token = appContext.token
  const geo = appContext.geo

  const { data: stationSoil } = useSWR(
    [geo, (31).toString(), token], 
    ([geo, product, token]) => fetchers.bomstn(geo, product, token)
  )
  const { data: agriSoil } = useSWR(
    () => [geo, stationSoil.data.station.id, token], 
    ([geo, station, token]) => fetchers.bomagri(geo, station, token)
  )

  if (!agriSoil || !agriSoil.data) {
    return <></>
  }

  let uiSoil = makeUiSoil(agriSoil.data.agri.soilTemp)

  return <>
    <table cellSpacing={0} className={classes.table}>
      <thead>
        <tr>
          <th className={clsx(classes.borderRight, classes.borderBottom)}>
            <Typography variant="body1" children='Depth' />
          </th>
          <th className={classes.borderBottom}>
            <Typography variant="body1" children='Temperature(°C)' />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={clsx(classes.td, classes.borderRight)}>

            {makeTDDepth(uiSoil, classes)}
          </td>
          <td className={classes.td}>
            {makeTDTemp(uiSoil)}
          </td>
        </tr>
      </tbody>
    </table>
  </>
}