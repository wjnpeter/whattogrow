import React from 'react'

class AppContext {
  token: string
  addr?: {
    locality?: any
    state?: any
    postcode?: any
  }
  geo?: string
  tempZone?: string
}

export default React.createContext(new AppContext());