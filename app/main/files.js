angular.module("app.files", ['app.auth', 'angularFileUpload'])

.controller('FilesCtrl', function ($scope, $ref, $group, $firebase, $upload) {
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
        $scope.files.$add({name: $files[0].name, creator: snap.val()});
      });
    }
  }

  $scope.$watch('id', function (newvalue, oldvalue) {
    if ($scope.files) {
      $scope.files.$off();
    }
    $scope.files = $firebase($ref.base.child('groups/' + $group.props.id + '/files'));
  });
})
