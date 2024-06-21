'use strict'

const mongoose = require('mongoose')
const plantSchema = require('../lib/models/plant-schema')

// 1. import .csv to prewtg 
//exec('mongoimport --db=prewtg --ignoreBlanks --collection=plants --type=csv --headerline --file=/Users/wygetlee/Downloads/test.csv')

// 2. format prewtg
mongoose.connect('mongodb://localhost/prewtg', { useNewUrlParser: true, useUnifiedTopology: true })
const predb = mongoose.connection

const prePlantSchema = new mongoose.Schema({
  name: String,
  category: String,
  time: {
    z1: String,
    z2: String,
    z3: String,
    z4: String,
    z5: String,
    z6: String,
  },
  depth: String,
  rowSpacing: String,
  spacing: String,
  frost: {
    type: String,
    enum: ['FT', 'H', 'HH']
  },
  sow: {
    type: String,
    enum: ['D', 'R', 'R/D', 'D/R']
  },
  germination: String,
  maturity: String
})

predb.model('Plant', prePlantSchema).find({}, function (err, docs) {

  const formattedPlants = []
  docs.forEach(function (doc) {
    const formattedPlant = {}

    const pretime = doc.time
    const time = {}
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for (let i = 1; i <= 6; ++i) {
      if (pretime['z' + i] == null) continue

      const monthRanges = pretime['z' + i].split(',')


      const months = []

      for (let mri = 0; mri < monthRanges.length; ++mri) {
        const timeRange = monthRanges[mri].split('-')
        timeRange[0] = monthNames.indexOf(timeRange[0]) + 1

        if (timeRange.length === 2) {
          timeRange[1] = monthNames.indexOf(timeRange[1]) + 1

          for (let m = Number(timeRange[0]); m !== Number(timeRange[1]); m === 12 ? m = 1 : ++m) {
            months.push(m)
          }
          months.push(Number(timeRange[1]))
        } else months.push(Number(timeRange[0]))

      }

      time['z' + i] = months
    }

    formattedPlant.time = time

    const prename = doc.name
    formattedPlant.name = prename

    const precategory = doc.category
    formattedPlant.category = precategory.toLowerCase()

    const predepth = doc.depth
    if (predepth != null) {
      formattedPlant.depth = String(predepth).split('-').map(v => Number(v))
    }

    const preRowSpacing = doc.rowSpacing
    if (preRowSpacing != null) {
      formattedPlant.rowSpacing = String(preRowSpacing).split('-').map(v => Number(v))
    }

    const preSpacing = doc.spacing
    if (preSpacing != null) {
      formattedPlant.spacing = String(preSpacing).split('-').map(v => Number(v))
    }

    const preGermination = doc.germination
    if (preGermination != null) {
      formattedPlant.germination = String(preGermination).split('-').map(v => Number(v))
    }

    const preMaturity = doc.maturity
    if (preMaturity != null) {
      formattedPlant.maturity = String(preMaturity).split('-').map(v => Number(v))
    }

    // enum: ['FT', 'H', 'HH'] 
    const preFrost = doc.frost
    // enum: ['tender', 'hardy', 'half hardy']
    switch (preFrost) {
      case 'FT':
        formattedPlant.frost = 'tender'
        break
      case 'H':
        formattedPlant.frost = 'hardy'
        break
      case 'HH':
        formattedPlant.frost = 'half hardy'
        break
    }

    // enum: ['D', 'R', 'R/D', 'D/R']
    const preSow = doc.sow
    // enum: ['direct', 'seedling']
    if (preSow != null) {
      const sow = []
      if (preSow.includes('D')) sow.push('direct')
      if (preSow.includes('R')) sow.push('seedling')
      formattedPlant.sow = sow
    }

    formattedPlant.wikiName = null

    formattedPlants.push(formattedPlant)
  })

  const db = mongoose.createConnection('mongodb://localhost/wtg', { useNewUrlParser: true, useUnifiedTopology: true })
  const Plant = db.model('Plant', plantSchema)

  Plant.insertMany(formattedPlants, (err, docs) => {
    if (err) console.log(err)
    else console.log('Inserted: ' + docs.length)
  })
})

// export to Altas
// mongoimport --host wtg-shard-0/wtg-shard-00-00-ammh9.mongodb.net:27017,wtg-shard-00-01-ammh9.mongodb.net:27017,wtg-shard-00-02-ammh9.mongodb.net:27017 --ssl --username admin --password <PASSWORD> --authenticationDatabase <USERNAME> --db wtg --collection plants --type json --file /Users/wygetlee/Web/whattogrow_ref/data.json