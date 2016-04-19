'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Recipe = mongoose.model('Recipe'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  nutrify = require(path.resolve('./modules/recipes/server/controllers/nutrify.js'));






  
/**
 * Create a recipe..
 */

var AWS = require('aws-sdk');
AWS.config = config.awscred;

exports.create = function (req, res) {
  console.log('happens1');
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

exports.edUploadPic = function(req,res){
  //console.log(config.awscred);

  var dataURL = req.body.pic;
  //var newURL = '';

  //console.log(req.body.pic);
  //console.log(req.body._id);

  var buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ''),'base64');
    

  var s3 = new AWS.S3();
  s3.putObject({
    ACL: 'public-read',
    Bucket: 'finalrecipepictures',
    Key: req.body._id + '.jpg',
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  }, function(error, response) {
    //console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    //console.log(arguments);
    console.log('happened');
    if(error){
      console.log(error);
    }
  });

 
  var imageURL = ('https://s3.amazonaws.com/finalrecipepictures/'+req.body._id+'.jpg');
    
   
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
  console.log('calling update in server.\n');
  var recipe = req.recipe;

  //console.log(req.body);

  recipe.title = req.body.title;
  recipe.instructions = req.body.instructions;
  recipe.servings = req.body.servings;
  recipe.cook_time = req.body.cook_time;
  recipe.healthy_ing = req.body.healthy_ing;
  recipe.imgURL = req.body.imgURL;

  console.log(recipe);

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
  var s3 = new AWS.S3();
  console.log(recipe.imgURL);
  var fileName = recipe.imgURL.substring(recipe.imgURL.lastIndexOf('/')+1);
  console.log(fileName);
  s3.deleteObjects({
    Bucket: 'finalrecipepictures',
    Delete: {
      Objects: [
       { Key: fileName }
      ]
    }
  }, function(err, data) {

    if (err)
      return console.log(err);

    console.log('success');

  });

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
  //console.log('entered find Foods serverside ' + JSON.stringify(req.foodList));

  if(!req.errorCode){
    console.log('success on foodlist');
    res.json(req.foodList);
  }else{
    console.log('fail => error code');
    res.json(req.errorCode);
  }

};
exports.returnFoodReport = function(req,res){
  console.log('findFoodReport serverside entered ' + req.nutrients);
  res.json(req.nutrients);
};
exports.returnAlternatives = function(req,res){
  if(!req.errorCode){
    console.log('success on foodlist');
    res.json(req.alternatives);
  }else{
    console.log('fail => error code');
    res.json(req.errorCode);
  }
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
  }).catch(function(reason){
    console.log('error');
    req.errorCode = reason;
    next();
  });

};

exports.getAlternatives = function(req,res,next,foodObject){
  var jsonObject = JSON.parse(foodObject);
  console.log(JSON.stringify(jsonObject));

  nutrify.healthify(jsonObject.query,jsonObject.ndbno,true,jsonObject.nutId,jsonObject.minimize).then(function(result){
    req.alternatives = result;
    next();
  }).catch(function(reason){
    req.errorCode = reason;
    next();
  });
};
  