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

.controller('NameCtrl', function ($scope, $ref, $group, $modalInstance) {
  $scope.newprops = {};
  $scope.setName = function () {
    $ref.base.child('groups/' + $group.props.id + '/props/name').set($scope.newprops.name);
    $modalInstance.close();
  };
})

.controller('MembersCtrl', function ($scope, $ref, $group, $users, $location, $modal, $timeout) {
  $scope.my = {}
  $scope.selected = {}
  $scope.users = $users.groups;
  $scope.info = $users.users;
  $scope.group = $group.props;
  $scope.subgroups = {};
  var watching = {};
 
  // why do we turn off updating whenever we change ids?
  // we should just always update
  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (!newvalue) {
      $location.path('/bigevents');
    } else {
      if (!watching[newvalue]) {
        watching[newvalue] = true;
        $ref.base.child('groups/' + newvalue + '/subgroups').on('child_added', function (snap) {
          console.log('child added');
          var subid = snap.val();
          $ref.base.child('groups/' + subid + '/props/name').on('value', function (name) {
            $timeout(function () {
              $scope.$apply(function () {
                $scope.subgroups[subid] = {groupid: subid, name: name.val()};
              })
            }, 0);
          });
        });
        $ref.base.child('groups/' + newvalue + '/subgroups').on('child_removed', function (snap) {
          var subid = snap.val();
          console.log('child removed');
          $timeout(function () {
            $scope.$apply(function () {
              delete $scope.subgroups[subid];
            });
          }, 0);
          $ref.base.child('groups/' + subid + 'props/name').off();
        });
      }
    }
  });

  $scope.privitize = function () {
    if ($group.props.private) {
      $ref.base.child('groups/' + $group.props.id + '/props/private').set(false);
      $ref.base.child('groups/' + $group.props.parent + '/subgroups/' +
          $group.props.id).set($group.props.id);
    } else {
      $ref.base.child('groups/' + $group.props.id + '/props/private').set(true);
      $ref.base.child('groups/' + $group.props.parent + '/subgroups/' + $group.props.id).remove();
    }
  }
 
  $scope.newSubgroup = function () {
    var newgroup = $ref.base.child('groups').push();
    var newname = newgroup.name();
    if (!$group.props.parent) {
      $ref.base.child('groups/' + $group.props.id + '/subgroups/' + newname).set(newname);
    } else {
      $ref.base.child('groups/' + $group.props.parent + '/subgroups' + newname).set(newname);
    }
    newgroup.child('props').set({
        name: 'Untitled Group',
        groupid: newname,
        classcode: $group.props.classcode,
        private: false,
        parent: $group.props.parent || $group.props.groupid
    }, function (err) {
      $group.setGroup(newname);
      $scope.joinGroup(newname);
    });
  }

  $scope.joinGroup = function (gid) {
    $ref.base.child('groups/' + gid + '/users/' + $ref.netid).set($ref.netid);
    $ref.base.child('users/' + $ref.netid + '/groups/' + gid).set(gid);
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
