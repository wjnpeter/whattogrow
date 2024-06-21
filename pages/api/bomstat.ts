import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'

import { getHistoricalData } from 'bom-stat'
import mws from '../../lib/api/middlewares'
import { isStation, isProductCode } from '../../lib/api/validators'
import { ApiStation, ApiStat } from '../../lib/api/interfaces'

interface ResData {
  station: ApiStation
  product: string
  stats: ApiStat
  ytd: ApiStat
}

// for bom-stat package

const toTypeAndAbout = (product: string) => {
  let ret = {} as any
  switch (product) {
    case '139':
      ret.type = 'monthly'
      ret.about = 'rainfall'
      break
    case '36':
      ret.type = 'monthly'
      ret.about = 'maxtemperature'
      break
    case '38':
      ret.type = 'monthly'
      ret.about = 'mintemperature'
      break
    case '136':
      ret.type = 'daily'
      ret.about = 'rainfall'
      break
    case '122':
      ret.type = 'daily'
      ret.about = 'maxtemperature'
      break
    case '123':
      ret.type = 'daily'
      ret.about = 'mintemperature'
      break
  }

  return ret
}

interface bomStatPackageResData {
  station: string
  year: string
  data: {
    annual: string,
    months: string[]
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const product = req.query.product
  const station = req.query.station

  if (!isStation(station) || !isProductCode(product)) {
    return res.status(400).end('Invalid Params')
  }

  const params = {
    station: station,
    logging: true,
    ...toTypeAndAbout(product as string)
  }

  if (params.type === 'daily') {
    // To support daily data, need to:
    // fix bom-stat to return same type of data first
    res.status(200).end('Daily data not support')
    return
  }

  const data = await getHistoricalData(params) as bomStatPackageResData[]

  const curYear = new Date().getFullYear()
  const lastYear = curYear - 1
  const thirtyYrsAgo = lastYear - 30
  const meanHistorical = calMean(data, thirtyYrsAgo, lastYear)
  const meanYtd = calMean(data, curYear, curYear)

  const resData: ResData = {
    station: { id: station as string },
    product: product as string,
    stats: meanHistorical,
    ytd: meanYtd
  }

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

function calMean(stats: bomStatPackageResData[], from: number, to: number): ApiStat {
  if (_.isNil(stats)) return {} as ApiStat

  const range = {
    start: stats.findIndex(v => from <= Number(v.year)),
    end: stats.findIndex(v => to <= Number(v.year))
  }

  range.start = Math.max(range.start, 0)
  if (range.end === -1) {
    range.end = stats.length - 1
  }

  const statsRange = stats.slice(range.start, range.end + 1)
  const meanAnnual = _.meanBy(statsRange, stn => _.toNumber(stn.data.annual))

  const meanMonths: number[] = []
  for (let i = 0; i < 12; ++i) {
    const meanMonth = _.meanBy(statsRange, stn => _.toNumber(stn.data.months[i]))
    meanMonths.push(meanMonth)
  }

  return {
    start: stats[range.start].year,
    end: stats[range.end].year,
    annual: _.round(meanAnnual),
    months: meanMonths.map(v => _.round(v))
  }
}