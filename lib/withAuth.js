// a HOC for protected pages
import jwt from 'jsonwebtoken'

import { useState } from 'react'

export default function withAuth(AuthComponent) {
  return function Authenticated(props) {
    const [logged, setLogged] = useState(true)
    
    const token = jwt.sign({ user: 'admin' }, process.env.LOGIN_KEY)

    return <>
        {!logged ? <div>Not Authorised....</div> : 
          <AuthComponent {...props} token={token} />
        }
      </>
    
  }
}