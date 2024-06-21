
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

import mws from '../../lib/api/middlewares'
import { isLatLon } from '../../lib/api/validators'
import { log } from '../../lib/utils'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const geo = req.query.geo
  
  if (!isLatLon(geo)) {
    return res.status(400).end('Invalid Params')
  }

  log('Start api: ds')

  const endPt = 'https://api.darksky.net/forecast'
  const k = '/' + process.env.DARKSKY_API_KEY

  const url = new URL(endPt + k + '/' + geo)
  url.searchParams.append('exclude', 'minutely,hourly')
  url.searchParams.append('units', 'ca')

  const response = await axios.get(url.toString())

  res.status(200).json(response.data)
}

export default mws.validateToken(handler)

export const config = {
  api: {
    externalResolver: true,
  },
}