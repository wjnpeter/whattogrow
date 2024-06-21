import axios from 'axios'
import _ from 'lodash'
import qs from 'qs'

import { NextApiRequest, NextApiResponse } from 'next'

import mws from '../../lib/api/middlewares'
import { ApiSeedFilter } from '../../lib/api/interfaces'

// normalize name for wiki
const wikiTitle = (t: any) => {
  let ret = t.replace(',', '_')
  return ret.replace(' ', '_')
}

const avg = (v: any) => {
  const sum = v.reduce((a: any, b: any) => a + b, 0);
  return (sum / v.length) || 0;

}

const addRate = (p: any) => {
  let rate = 0.5

  const depth = avg(p.depth)
  if (depth > 15) rate += 1
  else if (depth > 5) rate += 0.5

  const spacing = avg(p.spacing)
  if (spacing > 75) rate += 1
  else if (spacing > 25) rate += 0.5

  const rowSpacing = avg(p.rowSpacing)
  if (rowSpacing > 150) rate += 1
  else if (rowSpacing > 50) rate += 0.5

  if (p.sow === 'seedling') rate += 0.5

  if (p.frost === 'tender') rate += 1
  else if (p.frost === 'half hardy') rate += 0.5

  const germination = avg(p.germination)
  if (germination > 15) rate += 1
  else if (germination > 10) rate += 0.5

  const maturity = avg(p.maturity)
  if (maturity > 100) rate += 1
  else if (maturity > 50) rate += 0.5

  p.rate = Math.min(5, rate)
}

const perPage = 50

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const qFilter = req.query.filter as string
  const apiFilter = qFilter ? qs.parse(qFilter) as ApiSeedFilter : null


  let filter: any = {}
  if (!_.isNil(apiFilter)) {
    if (!_.isNil(apiFilter.tempZone) && !_.isNil(apiFilter.month)) {
      // month in db is from 1 to 12
      filter['time.z' + apiFilter.tempZone.code] = Number(apiFilter.month) + 1
    }

    if (!_.isNil(apiFilter.ids)) {
      filter._id = { $in: apiFilter.ids }
    }

    if (!_.isNil(apiFilter.category)) {
      filter.category = { $in: apiFilter.category }
    }
  }

  let page = null
  if (apiFilter?.page) {
    page = _.toNumber(apiFilter?.page ? apiFilter.page : 0)
  }


  const models = req.models

  // GET
  let foundPlants = await models.Plant.find(filter, null, {
    sort: 'name',
  })

  const plantTotal = foundPlants.length
  const pageCount = Math.ceil(plantTotal / perPage)
  if (page) {
    foundPlants = foundPlants.slice(perPage * page, perPage * (page + 1))
  }

  const plants = foundPlants.map((e: any) => {
    const ret = e.toJSON({ virtuals: true })
    delete ret.__v

    ret.name = _.capitalize(ret.name)
    return ret
  })

  // calculate rate
  plants.forEach((p: any) => { addRate(p) })

  // Just get wiki info for the first 50 elements
  const plantsNames = plants.reduce((prev: any, cur: any) => {
    let name = wikiTitle(_.isNull(cur.wikiName) ? cur.name : cur.wikiName)
    return prev === '' ? name : prev + '|' + name
  }, '')


  const wikiParams = {
    action: "query",
    format: "json",
    prop: "extracts|pageimages|description",
    titles: plantsNames,
    exintro: 1,
    explaintext: 1,
    piprop: "thumbnail",
    pithumbsize: "840"
  }

  const wikiEndPt = 'https://en.wikipedia.org/w/api.php'
  const wikiRes = await axios.get(wikiEndPt, { params: wikiParams })

  if (wikiRes.data.query) {
    const pages = wikiRes.data.query.pages

    Object.values(pages).forEach((p: any) => {
      // match plants and wiki result
      const plant = plants.find((plant: any) => {
        const name = _.isNull(plant.wikiName) ? plant.name : plant.wikiName
        return _.lowerCase(name) === _.lowerCase(p.title)
      })

      if (plant) {
        plant.wiki = {
          extract: p.extract,
          thumbnail: p.thumbnail,
          description: p.description
        }
      }
    })
  }

  console.log('Found plants: ' + plantTotal)

  res.status(200).json({
    data: plants,
    pageCount: pageCount,
    plantTotal: plantTotal
  })

}

export default mws.validateToken(mws.connectToPlant(handler))

export const config = {
  api: {
    externalResolver: true,
  },
}