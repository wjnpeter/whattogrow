
import { NextApiRequest, NextApiResponse } from 'next'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import ftpClient from 'ftp'
import os from 'os'

import { getState } from '../../lib/api/utils'
import mws from '../../lib/api/middlewares'
import { isLatLon, isStation } from '../../lib/api/validators'
import { log } from '../../lib/utils'
import { ApiStation, ApiAgri, IDictionary } from '../../lib/api/interfaces'
import { BomXmlAgri as BomXmlAgri, parsers } from '../../lib/api/parsers'

interface ResData {
  station: ApiStation | null
  agri: ApiAgri | null
}

const agriDef: IDictionary = {
  'tx': 'maxTemp',
  'tn': 'minTemp',
  'tg': 'terrTemp',
  'r': 'precip',
  'ev': 'evaporation',
  'sn': 'sunshine',
  'twd': 'wetbulbTemp',
  'solr': 'solar',
  'wr': 'wind'
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const geo = req.query.geo
  const station = req.query.station

  if (!isStation(station) || !isLatLon(geo)) {
    return res.status(400).end('Invalid Params')
  }

  log('Start api: bomagri')

  const state = await getState(geo as string)
  log('Get state for: ' + geo + ' is ' + state)
  const [foundStation, foundAgri] = await getAgri(station as string, state)

  const apiAgri: ApiAgri = new ApiAgri()
  _.forOwn(foundAgri, (v, k) => {
    if (_.has(agriDef, k)) {
      apiAgri[agriDef[k] as string] = _.toNumber(v)
    } else {
      apiAgri.soilTemp[k] = _.toNumber(v)
    }
  })

  log('Found Agri: ' + _.isNil(foundStation) ? null : foundStation!.id)
  // construct res
  const resData: ResData = {
    station: foundStation,
    agri: apiAgri
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

// helper

const agriList: IDictionary = {
  NSW: 'IDN65176.xml',
  ACT: 'IDN65176.xml',
  NT: 'IDD65176.xml',
  QLD: 'IDQ60604.xml',
  SA: 'IDS65176.xml',
  TAS: 'IDT65176.xml',
  VIC: 'IDV65176.xml',
  WA: 'IDW65176.xml',

  host: 'ftp.bom.gov.au',
  path: function (s: string): string { return '/anon/gen/fwo/' + this[s] }
}

async function getAgri(station: string, state: string): Promise<[ApiStation | null, BomXmlAgri | null]> {
  return new Promise((resolve, reject) => {

    // 1. create directory 
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-'))
    const xmlFile = path.join(tmpDir, agriList[state])

    const c = new ftpClient();
    c.on('ready', function () {
      c.get(agriList.path(state), function (err, stream) {
        if (err) throw err;

        stream.once('close', function () { c.end(); })

        // 2. download xml file
        stream.pipe(fs.createWriteStream(xmlFile))
      })
    })

    c.on('end', function () {
      log('Parse agri file: ' + xmlFile)

      parsers.xmlAgriBulletin(xmlFile, station).then(result => {
        fs.rmdirSync(tmpDir, { recursive: true })
        resolve(result)
      })

    })

    c.connect({ host: agriList.host });
  })
}

