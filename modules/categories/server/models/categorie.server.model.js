'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: String,
  tag: String
});

mongoose.model('Category', CategorySchema);
