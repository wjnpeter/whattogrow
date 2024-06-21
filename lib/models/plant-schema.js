'use strict'

const mongoose = require('mongoose')

const month = {
  type: [Number]
}

const range = {
  type: [Number],
  validate: {
    validator: function(v) {
      return v.length <= 2
    }
  },

}

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    maxlength: 20,
    required: true,
    unique: true
  },
  category: {
    type: String,
    lowercase: true,
    enum: ['vegetable', 'flower', 'herb'],
    required: true
  },
  time: {
    z1: month,
    z2: month,
    z3: month,
    z4: month,
    z5: month,
    z6: month,
  },
  depth: range,
  rowSpacing: range,
  spacing: range,
  frost: {
    type: String,
    enum: ['tender', 'hardy', 'half hardy']
  },
  sow: {
    type: [String],
    enum: ['direct', 'seedling']
  },
  germination: range,
  maturity: range,
  wikiName: String
})

module.exports = plantSchema