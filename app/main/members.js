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

.controller('NameCtrl', function ($scope, $ref, $group, $instance) {
  $scope.newprops = {};
  $scope.setName = function () {
    $ref.base.child('groups/' + $group.props.id + '/props/name').set($scope.newprops.name);
    $modalInstance.close();
  };
})

.controller('MembersCtrl', function ($scope, $ref, $group, $users, $location, $modal) {
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
          $scope.subgroups[subid] = {groupid: subid, name: name.val()};
        });
      });
      $ref.base.child('groups/' + newvalue + '/subgroups').on('child_removed', function (snap) {
        var subid = snap.val();
        delete $scope.subgroups[subid];
        $ref.base.child('groups/' + subid + 'props/name').off();
      });
    }
  });
 
  $scope.newSubgroup = function () {
    var newgroup = $ref.base.child('groups').push();
    var newname = newgroup.name();
    $ref.base.child('users/' + $ref.netid + '/groups/' + newname).set(newname);
    $ref.base.child('groups/' + $group.props.id + '/subgroups/' + newname).set(newname);
    newgroup.child('props').set({
        name: 'Untitled Group',
        groupid: newname,
        classcode: $group.props.classcode,
        parent: $group.props.parent || $group.props.groupid
    }, function (err) {
      $group.setGroup(newname);
    });
  }

  $scope.changeName = function () {
    $modal.open({
      templateUrl: 'changeNameId',
      controller: 'NameCtrl'
    });
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
