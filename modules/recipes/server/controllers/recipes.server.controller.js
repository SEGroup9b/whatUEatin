'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recipe = mongoose.model('Recipe'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nutrify = require(path.resolve('./modules/recipes/server/controllers/nutrify.js')),
  config = require(path.resolve('./config/development.js')),
  
/**
 * Create a recipe
 */
exports.create = function (req, res) {
  var recipe = new Recipe(req.body);
  recipe.user = req.user;

  recipe.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipe);
    }
  });
};

/**
 * Show the current recipe
 */
exports.read = function (req, res) {
  res.json(req.recipe);
};

/**
 * Update a recipe
 */
exports.update = function (req, res) {
  var recipe = req.recipe;

  recipe.title = req.body.title;
  recipe.directions = req.body.directions;

  recipe.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipe);
    }
  });
};

/**
 * Delete an recipe
 */
exports.delete = function (req, res) {
  var recipe = req.recipe;

  recipe.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipe);
    }
  });
};

/**
 * List of Recipes
 */
exports.list = function (req, res) {
  Recipe.find().sort('-created').populate('user', 'displayName').exec(function (err, recipes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(recipes);
    }
  });
};
/*find food on usda database*/
exports.returnFoods = function(req,res){
  console.log('entered find Foods serverside ' + req.foodList);
  res.json(req.foodList);

};
exports.returnFoodReport = function(req,res){
  console.log('findFoodReport serverside entered ' + req.nutrients);
  res.json(req.nutrients);
};

/**
 * Recipe middleware
 */
exports.recipeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Recipe is invalid'
    });
  }

  Recipe.findById(id).populate('user', 'displayName').exec(function (err, recipe) {
    if (err) {
      return next(err);
    } else if (!recipe) {
      return res.status(404).send({
        message: 'No recipe with that identifier has been found'
      });
    }
    req.recipe = recipe;
    next();
  });
};
exports.getFoodReport = function(req,res,next,ndbno){
  console.log('Get food report middleware ' + ndbno);
  nutrify.food_report(ndbno).then(function(result){
    req.nutrients = result;
    console.log(result + ' ' + result.nutrients);
    next();
  });
};
exports.getName = function(req,res,next,name){
  console.log('printing body ' + name);
  nutrify.find_foods(name,'').then(function(result){
    console.log(result);
    req.foodList = result;
    next();
  });
  
};


/*Amazon s3 upload*/
exports.upload = function(req,res){
  var recipe = req.recipe;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newRecipePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  var uuid = require('node-uuid');
  var AWS = require('aws-sdk');

  AWS.config.region = 'US Standard';
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;
  var recipeUUID = uuid.v4();
  if (recipe) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        var params = {Key: recipeUUID, Body: 'Hello!'};
        s3bucket.upload(params, function(err, data) {
          if (err) {
            console.log("Error uploading data: ", err);
          } else {
            console.log("Successfully uploaded data to myBucket/myKey");
          }
        });
        recipe.recipeImageURL = config.uploads.recipeUpload.dest + recipeUUID;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
  var s3bucket = new AWS.S3({params: {Bucket: 'testbucket9091'}});

  var params = {}
}
