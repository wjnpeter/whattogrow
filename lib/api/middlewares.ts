import { NextApiRequest, NextApiResponse } from 'next'
import jwt, { Secret } from 'jsonwebtoken'
import _ from 'lodash'

type NextHandler = (req: NextApiRequest, res: NextApiResponse) => void

// validateToken accepts a handler as a param and return a async function
const validateToken = (next: NextHandler) => (req: NextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers['authorization'];

  let verified = false
  if (typeof authHeader !== 'undefined') {
    const bearer = authHeader.split(' ');
    const token = bearer[1];

    const decoded: any = jwt.verify(token, process.env.LOGIN_KEY as Secret);
    verified = _.has(decoded, 'user') ? decoded.user === 'admin' : false
  }

  if (!verified) {
    res.status(403).end()
    return
  }

  next(req, res)
}

import connectToMongo from './connect-to-mongo';

declare module 'next' {
  interface NextApiRequest {
    models: any
  }
}

const connectToPlant = (next: NextHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const { connection, models } = await connectToMongo();

  req.models = models
  next(req, res);
}

export default {
  validateToken: validateToken,
  connectToPlant: connectToPlant
}