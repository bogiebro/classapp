angular.module("app.bigevents", ['app.auth', 'firebase', 'app.color'])

.controller('BigEventsCtrl', function ($scope, $ref, $color, $firebase) {
  $scope.names = {};
  $scope.groupEvents = {};
  $scope.groups = {};
  $scope.numGroups = 0;

  // use the color scheme
  $scope.getColor = $color;
  
  $ref.base.child('users/' + $ref.netid + '/groups').on('child_added', function (snap) {
    $scope.numGroups++;
    var gid = snap.val();
    $scope.groups[gid] = gid;
    $scope.names[gid] = $firebase($ref.base.child('groups/' + gid + '/props/name'));
    $scope.groupEvents[gid] = $firebase($ref.base.child('groups/' + gid + '/events'));
  });
  $ref.base.child('users/' + $ref.netid + '/groups').on('child_removed', function (snap) {
    $scope.numGroups--;
    var gid = snap.val();
    $scope.names[gid].$off();
    $scope.groupEvents[gid].$off();
  })
})
