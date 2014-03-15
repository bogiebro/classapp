angular.module("app.members", ['app.auth'])

.controller('MembersCtrl', function ($scope, $group, $users) {
  $scope.users = $users.groups;
  $scope.info = $users.users;
  $scope.group = $group.props;
  $group.setGroup('testgroup');
})
