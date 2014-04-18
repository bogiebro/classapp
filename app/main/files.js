angular.module("app.files", ['app.auth', 'angularFileUpload'])

.controller('NewDocCtrl', function ($scope, $ref, $group, $modalInstance, $window) {
  $scope.namer = {}
  $scope.namedDoc = function() {
    var filename = $scope.namer.name;
    var fileref = $ref.base.child('notes').push({name: filename, creator: $ref.netid});
    var link = '/editor#?note=' + fileref.name();
    $ref.base.child('users/' + $ref.netid + '/props/name').once('value', function(snap) {
      $ref.base.child('groups/' + $group.props.id + '/files').push(
        {name: filename, creator: snap.val(), ref: link},
        function () {
          $window.open(link);
          $modalInstance.close(); 
        }
      );
    });
  }
})

.controller('FilesCtrl', function ($scope, $ref, $group, $firebase, $upload, $location, $modal) {
  $scope.group = $group.props;
  $scope.uploadthing = {};
  $scope.uploadthing.progress = 0;
  $scope.onSelect = function($files) {
    if ($scope.uploadthing.progress == 0) {
      $upload.upload({
        url: '/newfile/' + $group.props.id,
        method: 'POST',
        file: $files[0],
        fileFormDataName: 'myFile'
      });
      $ref.base.child('users/' + $ref.netid + '/props/name').once('value', function(snap) {
        $scope.files.$add({name: $files[0].name, creator: snap.val(),
          ref: $PROCESS_ENV_S3URL + '/docs/' + $group.props.id + '/' +
            encodeURIComponent($files[0].name)});
      });
    }
  }

  $scope.createDoc = function() {
    $modal.open({
        templateUrl: 'nameId',
        controller: 'NewDocCtrl'
    });
  }

  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (!newvalue) {
      $location.path('/bigevents');
    } else {
      if ($scope.files) {
        $scope.files.$off();
      }
      $scope.files = $firebase($ref.base.child('groups/' + $group.props.id + '/files'));
    }
  });
})
