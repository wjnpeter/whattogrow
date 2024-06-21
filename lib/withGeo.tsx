
import _ from 'lodash'
import useSWR from 'swr'

import LoadingPage from '../components/LoadingPage'
import { fetchers } from '../lib/apiFetchers'

export interface UIGeo {
  geo: string
  addr: {
    locality?: any
    state?: any
    postcode?: any
  }
}

export default function withGeo(GeoComponent: any) {
  return function Authenticated(props: any) {

    const { data: gGeoRes } = useSWR([props.placeId, props.latlon], fetchers.gGeocoder)

    if (_.isNil(gGeoRes)) {
      return <LoadingPage />
    }

    const gGeoResult = gGeoRes.results[0]

    const { lat, lng } = gGeoResult.geometry.location

    const addrComponents = gGeoResult.address_components

    const locality = addrComponents.find((c: any) => c.types.includes('locality')) || addrComponents[0]
    const state = addrComponents.find((c: any) => c.types.includes('administrative_area_level_1'))
    const postcode = addrComponents.find((c: any) => c.types.includes('postal_code'))

    const geo: UIGeo = {
      geo: lat + ',' + lng,
      addr: {
        locality: _.isNil(locality) ? null : locality,
        state: _.isNil(state) ? null : state,
        postcode: _.isNil(postcode) ? null : postcode
      },
    }

    return <>
      <GeoComponent {...props} geo={geo} />
    </>

  }
}