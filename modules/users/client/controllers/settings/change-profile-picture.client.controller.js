'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader', '$http',
  function ($scope, $timeout, $window, Authentication, FileUploader, $http) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;




        //document.getElementById("displayNameDisplay").innerHTML = displayName;


    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });
    
    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });



    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
            console.log($scope.imageURL);
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };

    $scope.loadpic = function() {

      console.log('this happens');

    };

    $scope.edUploadUserPic = function(url){
      //console.log(url);
      console.log('first half runs');
      /*recipe.$update(function () {
        $location.path('recipes/' + recipe._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });*/
      //console.log($scope.user._id);
      //console.log($scope.imageURL);
     // console.log(document.getElementById("bobby").value);
     //console.log(document.getElementById('bobby').value);
      //document.getElementById('bobby').src ="model.jpg"

     


      $http.post('/api/users/picture',{ user_id: $scope.user._id, pic: $scope.imageURL });
     
      //console.log(response.length);
      
      //console.log(JSON.stringify(response));
    };
  }
]);
