angular.module("app.group", ['app.auth', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'ngDragDrop', 'ui.bootstrap.tpls'])

.controller('GroupCtrl', function ($scope, $http, $ref, $location, $firebase, $group, $timeout) {
 
  // Contains all user input
  $scope.model = {};

  // Map from groupid to object containing classcode, id, unread, and subgroups:
  // a map of subgroup id to an object containing id, name and unread
  $scope.myclasses = {}

  // Whether we should display a loading indicator;
  $scope.classLoadWaiting = true;

  // Number of groups found
  $scope.numGroups = 0;
  
  // Capture the current group
  $scope.group = $group.props;

  // Handle a dropped user from the members page
  $scope.onDrop = function ($event, $data, subid) {
    $ref.base.child('groups/' + subid + '/users/' + $data).set($data);
    $ref.base.child('users/' + $data + '/groups/' + subid).set(subid);
  };

  // Bind to the classes
  $ref.base.child('users/' + $ref.netid + '/groups').on('child_added', function (snap) {
    $scope.numGroups++;
    var gid = snap.val();
    $ref.base.child('groups/' + gid + '/props').on('value', function (groupsnap) {
      var gprops = groupsnap.val();
      if (gprops.parent) {
        if (!$scope.myclasses[gprops.parent]) {
          $scope.myclasses[gprops.parent] = {subgroups: {}, props: {}}
        }
        $scope.myclasses[gprops.parent].subgroups[gid] = gprops;
      } else {
        if (!$scope.myclasses[gid]) {
          $scope.myclasses[gid] = {subgroups: {}, props: {}};
        }
        $scope.myclasses[gid].props = groupsnap.val();
      }
    });
  });
  $ref.base.child('users/' + $ref.netid + '/groups').on('child_removed', function (snap) {
    $scope.numGroups--;
    var gid = snap.val();
    $ref.base.child('groups/' + gid + '/props').once('value', function (groupsnap) {
      $ref.base.child('groups/' + gid + '/props').off();
      var gprops = groupsnap.val();
      if (gprops.parent && $scope.myclasses[gprops.parent]) {
        delete $scope.myclasses[gprops.parent].subgroups[gid];
      } else if ($scope.myclasses[gid]) {
        delete $scope.myclasses[gid];
      }
    });
  });

  // Get class data
  $http.get('/classnames.json').then(function(result) {
    $timeout(function() {
      $scope.$apply($scope.classLoadWaiting = false);
    }, 0);
    $scope.classes = result.data;
  });
  
  // Filter out classes of which the user is currently a member
  $scope.notIn = function(val) {
    return $scope.myclasses && !$scope.myclasses[val.maingroup];
  }

  // Add the user to a class
  $scope.chooseClass = function(model) {
    $ref.base.child('groups/' + model.maingroup + '/users/' + $ref.netid).set($ref.netid);
    $ref.base.child('users/' + $ref.netid + '/groups/' + model.maingroup).set(model.maingroup);
    $http.post('/joinGroup/sharedClasses/' + model.maingroup);
    $scope.changeGroup(model.maingroup);
    $scope.model.pickedClass = '';
  }
  
  // Set the group to what the user clicks on
  $scope.changeGroup = function(gid) {
    $group.setGroup(gid);
    $location.path('/members');
  }
})
