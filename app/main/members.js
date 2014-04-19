angular.module("app.members", ['app.auth'])

.filter('userify', function() {
  return function(input, info) {
    if (input) {
      return input.map(function(id){
        return info[input];
      });
    } else {
      return undefined;
    }
  }
})

.controller('MembersCtrl', function ($scope, $ref, $group, $users, $location) {
  $scope.my = {}
  $scope.selected = {}
  $scope.users = $users.groups;
  $scope.info = $users.users;
  $scope.group = $group.props;
  $scope.subgroups = $group.subgroups
  
  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (!newvalue) {
      $location.path('/bigevents');
    }
  });
  
  $scope.setName = function(name){
    $ref.base.child('groups/' + $group.props.id + '/props/name').set(name);
    // what if we removed all cached copies of groups.
    // subgroups was a property of groups that had a map from id to id
    // groups was a property of users that had a map from groupid to groupid
    // group sidebar built pretty list by itself
    // we get subgroups by keeping a map group groupid to props, the same way our $users service works
  };

  $scope.setGroup = function (id) {
    $group.setGroup(id);
  };

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
