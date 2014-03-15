angular.module("app.members", ['app.auth'])

.controller('MembersCtrl', function ($scope, $group, $users) {
  $scope.users = $users.props.groups;
  $scope.info = $users.props.users;
  $scope.group = $group.props;
  $group.setGroup('testgroup');
})
