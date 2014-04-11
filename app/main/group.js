angular.module("app.group", ['app.auth', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'ui.bootstrap.tpls'])

.controller('GroupCtrl', function ($scope, $http, $ref, $location, $firebase, $group, $users, $modal, $timeout) {
 
  // Contains all user input
  $scope.model = {};
  
  // Capture the current group
  $scope.group = $group.object;

  // Bind to the classes
  $scope.myclasses = $firebase($ref.base.child('users/' + $ref.netid + '/classes'));
  console.log($scope.myclasses);

  $scope.myclasses.$on('change', function() {
    console.log('Classes changed');
    if ($scope.myclasses.$getIndex().length == 0) {
      $scope.showHelpText = true;
    } else {
      $scope.showHelpText = false;
    }
  });

  // Link to big events view
  // $scope.goBig = function() {
  //   $location.path('/bigevents');
  // }
 
  // Filter out classes of which the user is currently a member
  $scope.notIn = function(val) {
    return $scope.myclasses && !$scope.myclasses[val.code];
  }
  
  // Boolean to indicate loading class has finished
  $scope.classLoadWaiting = true;

   // Get class data
  $http.get('/classnames.json').then(function(result) {
    $scope.classLoadWaiting = false;
    $scope.classes = result.data;
  });

  // Add the user to a class
  $scope.chooseClass = function(model) {
    $ref.base.child('users/' + $ref.netid + '/classes/' + model.code).set({
      code: model.code,
      name: model.name,
      maingroup: model.maingroup,
      subgroups: []});
    $scope.model = {};
    $ref.base.child('groups/' + model.maingroup + '/users').push($ref.netid);
    $ref.base.child('users/' + $ref.netid + '/groups').push(model.maingroup);
  }
  
  // Set the group to what the user clicks on
  $scope.activeGroupId = undefined;
  $scope.changeGroup = function(gid) {
    console.log("Changing group to " + gid);
    $group.setGroup(gid);
    $scope.activeGroupId = gid;
    $location.path('/bigevents');
  }

  // Active class on or off
  $scope.getGroupClass = function(gid) {
    return $scope.activeGroupId == gid ? 'activeClass' : undefined
  }

  // Active sub group on or off
  $scope.getSubgroupClass = function(subgroup) {
    if(subgroup.id == $scope.activeGroupId) {
      return "activeSubgroup";
    } else {
      if(subgroup.creatorid == $ref.netid)
        return "greenGroup"
      else
        return "redGroup"
    }
  }

  // Green red marking based on creator
  $scope.getGroupColor = function(cid) {
    return $ref.netid == cid ? 'greenGroup' : 'redGroup'
  }  


  $scope.openRemoveClassModal = function(clickedClass, subgroup) {
      var modalInstance = $modal.open({
          templateUrl: 'removeClassModal.html',
          controller: removeClassModalInstanceCtrl,
          resolve: {
            rclass: function() {
              return function() {
                $scope.removeClass(clickedClass, subgroup);
              }
            },
            msg: function () {
              if(subgroup == undefined)
                return "Are you sure you want to remove " + clickedClass.name + "?";
              else
                return "Are you sure you want to remove " + subgroup.name + "?";
            }
          }
      });
  }

  var removeClassModalInstanceCtrl = function ($scope, $modalInstance, rclass, msg) {
    $scope.msg = msg;

    $scope.ok = function() {
     rclass();
     $modalInstance.close();
    }

    $scope.cancel = function() {
     $modalInstance.dismiss('cancel');
    }
  }

   // Permanently remove class from user's profile
   $scope.removeClass = function(clickedClass, subgroup) {
     console.log("Removing class " + clickedClass + " of " + $ref.netid)
      if(subgroup != undefined) {

        // Remove subgroup from all places
        $ref.base.child("users/" + $ref.netid + "/classes/" + clickedClass.code + "/subgroups/" + subgroup.name).remove();
        $ref.base.child("users/groups/" + subgroup.id).remove();
        $ref.base.child("groups/" + subgroup.id).remove();
      } else {

        // Remove the class from user
        $ref.base.child("users/" + $ref.netid + "/classes/" + clickedClass.code).remove(); 
        $ref.base.child("users/groups/" + clickedClass.maingroup).remove(); 
      }
  }
});
