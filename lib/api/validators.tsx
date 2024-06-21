import Validate from 'validate'
import _ from 'lodash'
import validator from 'validator';

export const isLatLon = (v: any) => {
  return _.isString(v) && validator.isLatLong(v)
}

export const isProductCode = (v: any) => {
  if (!_.isString(v)) return false

  const code = parseInt(v)
  return 0 < code && code < 150
}

export const isStation = (v: any) => {
  return _.isString(v) && v.length === 6
}