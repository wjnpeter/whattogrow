import mongoose from 'mongoose'

// we'll import all the schemas here and return them
// on the mongo connection object
// for use in the handlers
import plantSchema from '../models/plant-schema'

const connectToMongo = async () => {
  let connection = mongoose.connection
  if (!connection.readyState) {
    const s = 'mongodb+srv://' + process.env.DATABASE_USER + ':' + process.env.DATABASE_PSW + '@wtg.wmpotoi.mongodb.net/?retryWrites=true&w=majority&appName=wtg';
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

    await mongoose.connect(s, clientOptions)
    await mongoose.connection.db.admin().command({ ping: 1 });
    connection = mongoose.connection
  }
  
  const Plant = mongoose.models.Plant || connection.model('Plant', plantSchema)
  
  return {
    connection,
    models: {
      Plant
    }
  }
}

export default connectToMongo;