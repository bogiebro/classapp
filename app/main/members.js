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
  $scope.subgroups = {};
 
  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (!newvalue) {
      $location.path('/bigevents');
    } else {
      $ref.base.child('groups/' + oldvalue + '/subgroups').off();
      $ref.base.child('groups/' + newvalue + '/subgroups').on('child_added', function (snap) {
        var subid = snap.val();
        $ref.base.child('groups/' + subid + '/props/name').on('value', function (name) {
          subgroups[subid] = {groupid: subid, name: name.val()};
        });
      });
      $ref.base.child('groups/' + newvalue + '/subgroups').on('child_removed', function (snap) {
        var subid = snap.val();
        delete subgroups[subid];
        $ref.base.child('groups/' + subid + 'props/name').off();
      });
    }
  });
  
  $scope.setName = function(name){
    $ref.base.child('groups/' + $group.props.id + '/props/name').set(name);
  };

  $scope.setGroup = function (id) {
    $group.setGroup(id);
  };

  // remove a user from the group
  $scope.removeUser = function() {
    $ref.base.child('groups/' + $group.props.id + '/users/' + $ref.netid).remove();
    $ref.base.child('users/' + $ref.netid + '/groups/' + $group.props.id).remove();
    $group.clearGroup();
  }
});
