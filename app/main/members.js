angular.module("app.members", ['app.auth'])

.filter('userify', function() {
  return function(input, info) {
    return input.map(function(id){
      return info[input];
    });
  }
})

.controller('MembersCtrl', function ($scope, $ref, $group, $users, $location) {
  $scope.my = {}
  $scope.selected = {}
  $scope.users = $users.groups;
  $scope.info = $users.users;
  $scope.group = $group.props;
  
  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (!newvalue) {
      $location.path('/bigevents');
    }
  });

  // remove a user from the group
  $scope.removeUser = function() {
    $ref.base.child('groups/' + $group.props.id + '/users/' + $ref.netid).remove();
    $ref.base.child('users/' + $ref.netid + '/groups/' + $group.props.id).remove();
    if (!$group.props.maingroup) {
      $ref.base.child('users/' + $ref.netid + '/classes/' +
        $group.props.classCode + '/subgroups/' + $group.props.id).remove();
    } else {
      $ref.base.child('users/' + $ref.netid + '/classes/' + $group.props.classCode).remove();
    }
    $group.clearGroup();
  }
})
