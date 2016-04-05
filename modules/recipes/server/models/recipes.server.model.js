'use strict';

/* Import mongoose and define any variables needed to create the schema */
var mongoose = require('mongoose'), 
  Schema = mongoose.Schema;

//I figure storing the original and "nutrified" recipes may be nice
//BTW: [String] just means an array of Strings
var recipeSchema = new Schema({

  //The user that uploaded the recipe
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  
  title: {
    type: String,
    default: '',
    trim: true,
    required: true
  },

  instructions: String,		// baking instructions
  servings: String,			// how many does this serve?
  cook_time: String,		// time required to make
  votes: Number,			// number of upthumblikes
  
  // Health tags for user dietary needs.

  tags: {
    allergies: [String],
    health_concerns: [String]
  },
  
  // Original ingredients
  orig_ing: [{
    item: String,
    quantity: Number,
    unit: String,
    food_item: {
      name: String,
      ndbno: Number,
      group: String,
      manu: String,
      nutrients: [{
        nutrient_id: Number,
        name: String,
        unit: String,
        value: Number
      }]
    }
  }],
  
  // Healthy ingredients
  healthy_ing: [{
    item: String,
    quantity: Number,
    unit: String,
    food_item: {
      name: String,
      ndbno: Number,
      group: String,
      manu: String,
      nutrients: [{
        nutrient_id: Number,
        name: String,
        unit: String,
        value: Number
      }]
    }
  }],

  //recipe image
  recipeImgURL: {
    type: String,
  },
  displayName: {
    type: String,
    trim: true
  },

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
