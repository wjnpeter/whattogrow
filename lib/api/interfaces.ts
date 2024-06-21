import _ from 'lodash'
import qs from 'qs'


export interface IDictionary {
  [key: string]: any
}

export interface ApiStation {
  id: string
  name?: string
}

export interface ApiStat {
  start: string
  end: string
  annual: number
  months: number[]
}

export class ApiAgri {
  maxTemp?: number
  minTemp?: number
  terrTemp?: number
  soilTemp: {
    t5?: number
    t10?: number
    t20?: number
    t50?: number
    t1m?: number
    [key: string]: any
  }
  precip?: number
  evaporation?: number
  sunshine?: number
  [key: string]: any

  constructor() {
    this.soilTemp = {}
  }
}

export class ApiZone implements NodeJS.Dict<number | string> {
  code: number
  descript: string
  
  [key: string]: number | string | undefined
}

export class ApiSeedFilter {
  tempZone?: ApiZone
  month?: number
  ids?: string[]
  page?: string
  category?: string
}

export const ApiCategories = ['vegetable', 'flower', 'herb']
