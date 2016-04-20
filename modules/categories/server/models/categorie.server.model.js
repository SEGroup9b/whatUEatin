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
  tag: String,
  img_path: String, //make sure this is local (doesn't support online URL paths)
  t_type: String
});

mongoose.model('Category', CategorySchema);
