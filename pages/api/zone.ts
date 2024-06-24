import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import { getClimateclass } from 'bom-climateclass'

import mws from '../../lib/api/middlewares'
import { isLatLon } from '../../lib/api/validators'
import { log } from '../../lib/utils'


async function handler(req: NextApiRequest, res: NextApiResponse) {
  let geo = req.query.geo
  const about = req.query.about

  if (!isLatLon(geo)) {
    return res.status(400).end('Invalid Params')
  }

  log('Start api: zone')

  geo = geo as string
  const lat = geo.split(',')[0].trim()
  const lon = geo.split(',')[1].trim()

  // GET
  const params = {
    type: about,
    lat: lat,
    lon: lon
  }
  
  const data = await getClimateclass(params)

  res.status(200).json(data)

}

export default mws.validateToken(handler)

export const config = {
  api: {
    externalResolver: true,
  },
}



