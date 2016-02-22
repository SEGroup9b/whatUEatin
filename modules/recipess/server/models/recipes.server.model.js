'use strict';

/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;

//I figure storing the original and "nutrified" recipes may be nice
//BTW: [String] just means an array of Strings
var recipeSchema = new Schema({

  //ingredients
  original_ingredients: [String],
  nutrified_ingredients: [String],

  //tags for allergies/health concerns. This should allow for eacy filtering
  tags: {
    allergies: [String],
    health_concerns: [String]
  },
  
  //The steps for cooking
  directions: String,

  //book-keeping
  updated_at: Date,
  created_at: Date
});

/* create a 'pre' function that adds the updated_at (and created_at if not already there) property */
recipeSchema.pre('save', function(next) {

  var currentDate = new Date();

  //if hasn't been created yet, set the date
  if (!this.created_at) {
    this.created_at = currentDate;
  }

  //always update this field
  this.updated_at = currentDate;

  //move to after the middleware
  next();
});

/* Use your schema to instantiate a Mongoose model */
var Recipe = mongoose.model('Recipe', recipeSchema);

/* Export the model to make it avaiable to other parts of your Node application */
module.exports = Recipe;
