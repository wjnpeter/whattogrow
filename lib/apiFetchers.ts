
import axios from 'axios'
import qs from 'qs'
import _ from 'lodash'
import { ApiZone, ApiSeedFilter } from './api/interfaces'

async function bomstn(geo: string, product: string, token: string) {
  return axios.get('/api/bomstn', {
    params: { geo, product },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}

async function bomagri(geo: string, station: string, token: string) {
  return axios.get('api/bomagri', {
    params: { geo, station },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}

async function bomstat(station: string, product: string, token: string) {
  return axios.get('api/bomstat', {
    params: { station, product },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}

async function zone(geo: string, about: string, token: string) {
  return axios.get('/api/zone', {
    params: { geo, about },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}

async function ds(geo: string, token: string) {
  return axios.get('/api/ds', {
    params: { geo },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}

async function moon(fcLength: number, token: string) {
  return axios.get('/api/moon', {
    params: { fcLength },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.data)
}


async function seeds(filter: string | null, token: string) {
  const params = {
    token: token,
    filter: filter
  }

  return axios.get('/api/seeds', {
    params: params,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    
  }).then(res => res.data)
}

async function gGeocoder(placeId: string, latlon: string) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json'
  return axios.get(url, {
    params: {
      place_id: _.isNil(placeId) ? null : placeId,
      latlng: _.isNil(latlon) ? null : latlon,
      key: process.env.GOOGLE_API_KEY
    }
  }).then(res => res.data)
}

export const fetchers = {
  bomstn: bomstn,
  bomagri: bomagri,
  bomstat: bomstat,
  zone: zone,
  ds: ds,
  moon: moon,
  gGeocoder: gGeocoder,
  seeds: seeds
}