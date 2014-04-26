angular.module("app.bigevents", ['app.auth', 'firebase'])

.controller('BigEventsCtrl', function ($scope, $ref, $firebase) {
  $scope.names = {};
  $scope.groupEvents = {};
  $scope.groups = {};
  
  $ref.base.child('users/' + $ref.netid + '/groups').on('child_added', function (snap) {
    var gid = snap.val();
    $scope.groups[gid] = gid;
    $scope.names[gid] = $firebase($ref.base.child('groups/' + gid + '/props/name'));
    $scope.groupEvents[gid] = $firebase($ref.base.child('groups/' + gid + '/events'));
  });
  $ref.base.child('users/' + $ref.netid + '/groups').on('child_removed', function (snap) {
    var gid = snap.val();
    $scope.names[gid].$off();
    $scope.groupEvents[gid].$off();
  })
})
