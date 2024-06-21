import mongoose from 'mongoose'

// we'll import all the schemas here and return them
// on the mongo connection object
// for use in the handlers
import plantSchema from '../models/plant-schema'

const connectToMongo = async () => {
  
  let connection = mongoose.connection
  if (!connection.readyState) {
    const s = 'mongodb+srv://' + process.env.DATABASE_USER + ':' + process.env.DATABASE_PSW + '@wtg-ammh9.mongodb.net/' + process.env.DATABASE_NAME

    await mongoose.connect(s, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
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