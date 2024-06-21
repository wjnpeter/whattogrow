import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'

import { getState, getStationByProduct, normalizeStation } from '../../lib/api/utils'
import mws from '../../lib/api/middlewares'
import { isLatLon, isProductCode } from '../../lib/api/validators'
import { log } from '../../lib/utils'
import { ApiStation } from '../../lib/api/interfaces'

interface ResData {
  station: ApiStation
  lat: number
  lon: number
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  let geo = req.query.geo
  const product = req.query.product

  if (!isLatLon(geo) || !isProductCode(product)) {
    return res.status(400).end('Invalid Params')
  }

  log('Start api: bomstn')

  geo = geo as string
  const state = await getState(geo)

  log('Get state for: ' + geo + ' is ' + state)

  const station = await getStationByProduct(geo, state, product as string)

  // construct response data
  const resData: ResData = {
    station: {
      id: normalizeStation(station.site),
      name: station.name
    },
    lat: _.toNumber(station.lat),
    lon: _.toNumber(station.lon)
  }
  
  log('Found station: ' + resData.station.id)
  res.status(200).json({
    data: resData
  })

}

export default mws.validateToken(handler)

export const config = {
  api: {
    externalResolver: true,
  },
}
