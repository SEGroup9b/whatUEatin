'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
<<<<<<< Updated upstream
 * Category Schema
 */
var CategorySchema = new Schema({
=======
 * Categorie Schema
 */
var CategorieSchema = new Schema({
>>>>>>> Stashed changes
  created: {
    type: Date,
    default: Date.now
  },
<<<<<<< Updated upstream
  name: String,
  tag: String
});

mongoose.model('Category', CategorySchema);
=======
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Categorie', CategorieSchema);
>>>>>>> Stashed changes
