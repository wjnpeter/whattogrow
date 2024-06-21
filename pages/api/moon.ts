import moment from 'moment'
import _ from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import getMoonNode from '../../lib/api/moon-node'

import mws from '../../lib/api/middlewares'

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const fcLength = _.toNumber(req.query.fcLength)

  if (!_.isNumber(fcLength)) {
    return res.status(400).end('Invalid Params')
  }

  let ret = []
  for (let i = 0; i < fcLength; ++i) {
    let fcDay = moment.utc().add(i, 'days')

    ret.push(getMoonNode(fcDay.format('YYYY-MM-DD')));
  }
  
  res.status(200).json(ret)
}

export default mws.validateToken(handler)

export const config = {
  api: {
    externalResolver: true,
  },
}