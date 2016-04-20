'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');

/**
 * Update user details
 */

/*EDS SHIT*/
var bucketName = '';

var AWS = require('aws-sdk');
AWS.config = config.awscred;
//var s3 = new aws.S3();

var newURL = '';

exports.edUploadPhoto = function(req,res){
 




};

exports.edCreateBucket = function(req, res){
  console.log('this happens');
/* s3.createBucket({Bucket: bucketName}, function() {
    console.log('created the bucket[' + bucketName + ']')  //failed bucket creation
    console.log(arguments);
  });*/
  /*s3.listBuckets(function(err, data) {
    if (err) { console.log('Error:', err); }
  else {
      for (var index in data.Buckets) {
        var bucket = data.Buckets[index];
        console.log('Bucket: ', bucket.Name, ' : ', bucket.CreationDate);   //this is for listing buckets!
      }
    }
  });*/
/*var s3 = new AWS.S3({params: {Bucket: 'bucketCreationTest', Key: 'myKey'}});
s3.createBucket(function(err) {
  if (err) { console.log("Error:", err); }        //successful bucket creation
  else {
    s3.upload({Body: 'Hello!'}, function() {
      console.log("Successfully uploaded data to myBucket/myKey");
    });
  }
});*/ 
/*var s3 = new AWS.S3({params: {Bucket: 'bucketCreationTest', Key: 'myKey'}});
s3.upload({Body: 'Hello again!'}, function() {
      console.log("Successfully uploaded data to myBucket/myKey");
    });*/

  //console.log(req.body.user_id);
  //var response = 'asah';
  //var buffer = new Buffer(req.body.pic, "utf-8");
 // console.log(buffer);
  var dataURL = req.body.pic;


  var buf = new Buffer(dataURL.replace(/^data:image\/\w+;base64,/, ''),'base64');
    

  var s3 = new AWS.S3();
  s3.putObject({
    ACL: 'public-read',
    Bucket: 'bucketCreationTest',
    Key: req.body.user_id + '.jpg',
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

  //var buffer = new Buffer;
 
  s3.getObject({ Bucket: 'bucketCreationTest', Key: req.body.user_id+'.jpg' }, function(err, data) { 
    if (err) console.log(err, err.stack); // an error occurred
    newURL = data.Body.toString();
  });

   //buffer.toString('utf-8');


  //respose =response.toString();
  //esponse = JSON.parse(response);

  

  //newURL = 'https://s3.amazonaws.com/bucketCreationTest/56fc357a93d77997114d12d1';
  //console.log(https://s3.amazonaws.com/bucketCreationTest/56fc357a93d77997114d12d1);
  //console.log('--------------');
  //console.log(newURL);
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = 'https://s3.amazonaws.com/bucketCreationTest/'+ req.body.user_id+'.jpg';
        console.log('https://s3.amazonaws.com/bucketCreationTest/'+ req.body.user_id+'.jpg');

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

};







/*END EDS SHIT*/






exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        console.log('Error in saving 1 ', err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)

        });
      } else {
        req.login(user, function (err) {
          if (err) {
            console.log('Error in saving login ', err);
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture'
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

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
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
