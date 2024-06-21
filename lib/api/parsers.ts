import fs from 'fs'
import _ from 'lodash'

import xml2js from 'xml2js'

import { normalizeStation } from './utils'
import { ApiStation } from './interfaces'

export class BomTxtStation {
  site: string
  name: string
  lat: string
  lon: string
  start: string
  end: string
  percentage: string
  aws: string
  [key: string]: string | number
}

export class BomXmlAgri {
  'tx': string | null
  'tn': string | null
  'tg': string | null
  'r': string | null
  'ev': string | null
  'sn': string | null
  't5': string | null
  't10': string | null
  't20': string | null
  't50': string | null
  't1m': string | null
  [key: string]: string | null
}

// e.g. ftp://ftp.bom.gov.au/anon2/home/ncc/metadata/lists_by_element/numeric/numANT_11.txt
function txtStations(filename: string): BomTxtStation[] {
  // 3. read to buffer
  const txtData = fs.readFileSync(filename)

  // 4. parse it
  var lines = txtData.toString().split("\n")

  const stationGeos: BomTxtStation[] = []

  const stationKeys: { name: string, keyIdx: number }[] = []
  for (let i = 0; i < lines.length; ++i) {
    const l = lines[i]

    // keys row
    if (l.includes('Site') && l.includes('Lat') && l.includes('Lon')) {
      let keyName = ''
      let keyIdx = -1

      const cols = l.split('')
      cols.forEach((c, ci) => {
        if (c === '\r') {
          if (keyName !== '' && keyIdx !== -1) {
            stationKeys.push({
              name: keyName,
              keyIdx: keyIdx
            })
          }
        } else if (c === ' ') {
          if (keyName !== '' && keyIdx !== -1) {
            if (keyName === '%') --keyIdx

            stationKeys.push({
              name: keyName,
              keyIdx: keyIdx
            })
          }

          keyName = ''
          keyIdx = -1
        } else {
          if (keyName === '') keyIdx = ci

          keyName += c
        }
      })

    } else if (!_.isEmpty(stationKeys)) {
      if (l === '\r') {
        break
      }

      if (l.includes('---')) {
        continue
      }

      let stationGeo = new BomTxtStation()
      stationKeys.forEach((key, idx) => {
        const subStart = Math.min(key.keyIdx, l.length)
        let subEnd = l.length
        if (idx + 1 < stationKeys.length) subEnd = stationKeys[idx + 1].keyIdx

        const v = l.substring(subStart, subEnd).trim()

        const keyName = key.name === '%' ? 'Percentage' : key.name
        stationGeo[_.lowerCase(keyName)] = _.isNumber(v) ? _.toNumber(v) : v
      })
      
      stationGeos.push(stationGeo)
    }
  }

  // 5. keep the stations that still open
  const stationsOpen = stationGeos.filter(stationGeo => {
    const yr = stationGeo.end.split(' ')[1]
    const curYr = new Date().getFullYear()

    return yr === _.toString(curYr)
  })

  return stationsOpen
}

// e.g. ftp://ftp.bom.gov.au/anon/gen/fwo/IDT65176.xml
async function xmlAgriBulletin(filename: string, station: string): Promise<[ApiStation | null, BomXmlAgri | null]> {
  return new Promise((resolve, reject) => {
    // 3. read to buffer
    const xmlData = fs.readFileSync(filename)

    // 4. parse it
    const parser = new xml2js.Parser()
    parser.parseString(xmlData, function (err: any, result: any) {
      // find the specific {station}
      const obs = result['weather-observations'].product[0].group[0].obs
      const foundOb = obs.find((ob: any) => {
        return normalizeStation(ob.$.site) === station
      })

      if (_.isNil(foundOb)) return resolve([null, null])

      const ret = new BomXmlAgri()
      foundOb && foundOb.d.forEach((data: any) => {
        ret[data.$.t] = data._
      })

      console.log('Found Agri Station: ' + foundOb.$.station)
      return resolve([{
        name: foundOb.$.station,
        id: normalizeStation(foundOb.$.site)
      }, ret])
    })
  })
}

export const parsers = {
  txtStations: txtStations,
  xmlAgriBulletin: xmlAgriBulletin
}