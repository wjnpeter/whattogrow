import axios from 'axios'
import ftpClient from 'ftp'
import fs from 'fs'
import xml2js from 'xml2js'
import path from 'path'
import os from 'os'
import { findNearest } from 'geolib'
import _ from 'lodash'

import { BomTxtStation as BomTxtStation, parsers } from './parsers'
import { IDictionary } from './interfaces'

export function normalizeStation(id: string): string {
  const preZeros = 6 - id.length
  return '0'.repeat(preZeros) + id
}

// return: 'state short name' 
export async function getState(geo: string): Promise<string> {
  const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
  url.searchParams.append('latlng', geo)
  url.searchParams.append('result_type', 'administrative_area_level_1')
  url.searchParams.append('key', process.env['GOOGLE_API_KEY'] as string)

  const gres = await axios.get(url.toString())

  if (gres.data.results.length === 0) {
    return Promise.reject('Can not found any addresses ')
  }

  const addrComponents = gres.data.results[0].address_components
  const state = addrComponents.find((v: any) => v.types.includes('administrative_area_level_1'))
  const country = addrComponents.find((v: any) => v.types.includes('country'))

  if (country && country.short_name !== 'AU') {
    return Promise.reject('Not in Australia')
  }

  return Promise.resolve(state.short_name)
}

// e.g. ftp://ftp.bom.gov.au/anon/gen/fwo/IDN60920.xml
const stationList: IDictionary = {
  NSW: 'IDN60920.xml',
  ACT: 'IDN60920.xml',
  NT: 'IDD60920.xml',
  QLD: 'IDQ60920.xml',
  SA: 'IDS60920.xml',
  TAS: 'IDT60920.xml',
  VIC: 'IDV60920.xml',
  WA: 'IDW60920.xml',

  host: 'ftp.bom.gov.au',
  path: function (s: any): string { return '/anon/gen/fwo/' + this[s] }
}

export async function getStation(latitude: string, longitude: string, state: string) {
  return new Promise((resolve, reject) => {

    // 1. create directory 
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-'))
    const xmlFile = path.join(tmpDir, stationList[state])

    const c = new ftpClient();
    c.on('ready', function () {
      c.get(stationList.path(state), function (err, stream) {
        if (err) throw err;

        stream.once('close', function () { c.end(); })

        // 2. download xml file
        stream.pipe(fs.createWriteStream(xmlFile));
      })
    })

    c.on('end', function () {
      // 3. read to buffer
      const xmlData = fs.readFileSync(xmlFile)

      // 4. parse it
      const parser = new xml2js.Parser()
      parser.parseString(xmlData, function (err: any, result: any) {
        // extract all stations
        const stations: any[] = []
        result.product.observations[0].station.forEach((o: any) => {
          const { 'bom-id': bomId, 'stn-name': stnName, lat, lon } = o.$

          stations.push({
            stnNumber: bomId,
            name: stnName,
            lat,
            lon
          })
        })

        fs.rmdirSync(tmpDir, { recursive: true })

        const ret = findNearest({ latitude: latitude, longitude: longitude }, stations)
        return resolve(ret)
      });

    })

    c.connect({ host: stationList.host });
  })
}

// e.g. ftp://ftp.bom.gov.au/anon2/home/ncc/metadata/lists_by_element/numeric/numANT_11.txt
const stationListByProduct: IDictionary = {
  NSW: 'NSW',
  ACT: 'NSW', // ACT is put in NSW list
  NT: 'NT',
  QLD: 'QLD',
  SA: 'SA',
  TAS: 'TAS',
  VIC: 'VIC',
  WA: 'WA',
  ANT: 'ANT',  // Antarctica, not use

  host: 'ftp.bom.gov.au',
  path: function (state: string, product: string) {
    return '/anon2/home/ncc/metadata/lists_by_element/numeric/' + this.filename(state, product)
  },
  filename: function (state: string, product: string) {
    let stateName = 'AUS'
    if (!_.isNull(state)) stateName = this[state]

    return 'num' + stateName + '_' + product + '.txt'
  },
}

export async function getStationByProduct(geo: string, state: string, product: string): Promise<BomTxtStation> {
  console.log('Start getStationByProduct: ' + stationListByProduct.path(state, product))

  return new Promise((resolve, reject) => {
    // 1. create directory 
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'wtg-'))
    const txtFile = path.join(tmpDir, stationListByProduct.filename(state, product))

    const c = new ftpClient();
    c.on('ready', function () {
      c.get(stationListByProduct.path(state, product), function (err, stream) {
        if (err) {
          reject('seems need to use numAUS_XXX.txt')
        }

        stream.once('close', function () { c.end(); })

        // 2. download txt file
        stream.pipe(fs.createWriteStream(txtFile));
      })
    })

    c.on('end', function () {
      const stations = parsers.txtStations(txtFile)

      const lat = geo.split(',')[0].trim()
      const lon = geo.split(',')[1].trim()

      const ret = findNearest({ lat, lon }, stations) as BomTxtStation

      console.log(txtFile)
      // fs.rmdirSync(tmpDir, { recursive: true })
      return resolve(ret)
    })

    c.connect({ host: stationListByProduct.host });
  })
}

