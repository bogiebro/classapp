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

  // Modal to create a new subgroup or edit a subgroup
  // $scope.openGroupModal = function(clickedClass, subgroupId) {

  //   $scope.changeGroup(clickedClass.maingroup);
    
  //   var modalInstance = $modal.open({
  //     templateUrl: 'groupModal.html',
  //     controller: GroupModalInstanceCtrl,
  //     resolve: {
  //       msg: function () {
  //         return "Create a new study group for " + clickedClass.code;
  //       },
  //       classCode : function() {
  //         return clickedClass.code
  //       },
  //       subgroups : function() {
  //         return $scope.myclasses[clickedClass.code]['subgroups']
  //       },
  //       subgroupId : function() {
  //         return subgroupId
  //       }
  //     }
  //   });
  // }

  // // The group creation modal
  // var GroupModalInstanceCtrl = function ($scope, $modalInstance, msg, classCode, subgroups, subgroupId) {
  //   $scope.msg = msg;
  //   $scope.newGroupMembers = [];
  //   $scope.gidToNid = $users.groups;//[$group.props.id];
  //   $scope.nidToUser = $users.users;
  //   console.log($scope.gidToNid);

  //   $scope.group = $group.props;

  //   $scope.newgroup = new Object();
  //   $scope.newgroup.options = ['open', 'closed'];
  //   $scope.newgroup.type = 'open';
  //   $scope.newgroup.desc = 'Some Description(Optional)';

  //   // Returns a compiled list of all members in selected class
  //   $scope.classMembers = new Array();
  //   $scope.newGroupMembers = new Array();
  //   $timeout(function() {
  //     console.log("Populating member list")
  //     var arr = $scope.gidToNid[$scope.group.id];
  //     if(arr != undefined) {
  //       // TODO: auto add user to new group
  //       for(i = 0; i < arr.length; i++) {
  //         nid = arr[i];
  //         userObj = $scope.nidToUser[nid];
  //         userObj.netid = nid;
  //         if(nid == $ref.netid) {
  //           $scope.newgroup.cid = userObj.netid;
  //           $scope.newgroup.creatorname = userObj.name;
  //         } else {
  //           if(subgroupId == '')
  //             $scope.classMembers.push(userObj);
  //           else
  //             $scope.newGroupMembers.push(userObj);
  //         }
  //       }
  //     }
  //     $scope.newgroup.name = $scope.getGroupName();
  //   }, 0);

  //   // Gets the size of an object
  //   $scope.getSize = function(obj) {
  //     var size = 0;
  //     var key;
  //     for (key in obj) {
  //         if (obj.hasOwnProperty(key)) size++;
  //     }
  //     return size + 1;
  //   }

  //   // Returns the next default name for a group
  //   $scope.getGroupName = function() {
  //     var size = $scope.getSize(subgroups);
  //     console.log("Got name: Group " + size);
  //     return "Group " + size;
  //   }

  //   $scope.ok = function() {
  //     console.log($scope.newGroupMembers.length);
  //     if($scope.isNameValid($scope.newgroup.name)) {
  //       // Get today's date
  //       var today = new Date();
  //       var dd = today.getDate();
  //       var mm = today.getMonth()+1;
  //       var yyyy = today.getFullYear();
  //       var todayDate = mm+'/'+dd+'/'+yyyy;
        
  //       $scope.newgroup.datecreated = todayDate;

  //       // Save the group to groups
  //       var pushref = $ref.base.child('groups/').push({
  //         props : {
  //           name : $scope.newgroup.name,
  //           datecreated : $scope.newgroup.datecreated,
  //           desc : $scope.newgroup.desc,
  //           creatorid : $scope.newgroup.cid,
  //           maingroup : false
  //         }
  //       });

  //       // Get the id of the new group in firebase
  //       var newgroupId = pushref.name();

  //       // Save the group under this user
  //       $ref.base.child('users/' + $ref.netid + '/classes/' + classCode + '/subgroups/' + $scope.newgroup.name).set({
  //         name : $scope.newgroup.name,
  //         type : $scope.newgroup.type,
  //         creatorid : $scope.newgroup.cid,
  //         id : newgroupId
  //       });

  //       // Push this member to the new group
  //       $ref.base.child('groups/users/' + newgroupId).push($ref.netid);

  //       // Save the group under each member
  //       for(i = 0; i < $scope.newGroupMembers.length; i++) {
  //         var nid = $scope.newGroupMembers[i].netid;
  //         console.log("Saving to " + nid);

  //         // Push this member to the group
  //         $ref.base.child('groups/' + newgroupId + '/users/').push(nid);

  //         // Push this group to the user
  //         $ref.base.child('users/' + nid + "/classes/" + classCode + "/subgroups/" + $scope.newgroup.name).set({
  //           name : $scope.newgroup.name,
  //           type : $scope.newgroup.type,
  //           creatorid : $scope.newgroup.cid,
  //           id : newgroupId
  //         });
  //       }

  //      $modalInstance.close();
  //    }
  //   }

  //   $scope.cancel = function() {
  //     $modalInstance.dismiss();
  //   }

  //   var transferMember = function(from, to, member) {
  //     to.push(member);
  //     var ind = from.indexOf(member);
  //     from.splice(ind, 1);
  //     console.log("Transfered " + member.netid + 'of group ' + from + " at " + ind);
  //   }

  //   $scope.addMemberToGroup = function(member) {
  //     transferMember($scope.classMembers, $scope.newGroupMembers, member);
  //   }

  //   $scope.removeGroupMember = function(member) {
  //     transferMember($scope.newGroupMembers, $scope.classMembers, member);
  //   }

  //   // Checks if the new group's name is valid
  //   $scope.isNameValid = function(newName) {
  //     return subgroups[newName] == undefined;
  //   }
  // }

  // // Group search modal
  // $scope.openSearchGroupModal = function(clickedClass) {

  //   // All groups under this class
  //   var groupArr = new Array();
  //   var groups = [];
  //   for(g in groups) {
  //     groupArr.push(groups[g]);
  //   }

  //   var modalInstance = $modal.open({
  //     templateUrl: 'searchGroupModal.html',
  //     controller: GroupSearchModalInstanceCtrl,
  //     resolve: {
  //       msg: function () {
  //         return "Search groups in " + clickedClass.code;
  //       },
  //       classCode: function() {
  //         return clickedClass.code;
  //       }, 
  //       groups: function() {
  //         return groupArr;
  //       }
  //      }
  //   });

  // }

  // // The group creation modal
  // var GroupSearchModalInstanceCtrl = function ($scope, $modalInstance, msg, classCode, groups) {
  //   console.log('Passed groups ' + groups);
  //   $scope.groups = groups;
  //   $scope.msg = msg;
  //   $scope.groupTypeOptions = ['open', 'closed'];
  //   $scope.groupType = 'open';
  //   $scope.groupSizeOptions = ['small', 'medium', 'large'];
  //   $scope.groupSize = 'small';

  //   $scope.ok = function() {
  //     $modalInstance.dismiss();
  //   }

  //   $scope.cancel = function() {
  //     $modalInstance.dismiss();
  //   }
  // }

});
