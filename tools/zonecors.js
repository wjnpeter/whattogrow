import { getClimateclass } from 'bom-climateclass'

import Cors from 'cors'

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors)

console.log('1111')
  const lat = req.query.lat
  const lon = req.query.lon
  const about = req.query.about

  // GET
  const params = {
    type: about,
    lat: lat,
    lon: lon
  }
  
  const data = await getClimateclass(params)
  
  res.status(200).json(data)

}

export default handler
