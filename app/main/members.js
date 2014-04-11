angular.module("app.members", ['app.auth'])

.controller('MembersCtrl', function ($scope, $ref, $group, $users, $location, $timeout, $modal, $route) {
  $scope.gidToNid = $users.groups;
  $scope.nidToUser = $users.users;
  $scope.group = $group.object;
  $scope.hasAdmin = true;

  if($scope.group.id == 'default')
    return;
  
  // Does this group have members other than this member
  $scope.hasMembers = false;

  // Recently used group names
  recentGroupNames = [];

  console.log("Members page clicked:")
  console.log($scope.group);
  console.log($scope.group.id);
  console.log($scope.nidToUser);


  // Selected list on the right
  $scope.selectedList = new Array();

  // Toggle for toolset for each member
  $scope.showIcons = '';

  // Returns a compiled list of all members in selected class/group
  $scope.groupMembers = new Array();
  $scope.classMembers = new Array();
  $scope.newgroup = new Object();
  $timeout(function() {
    // console.log("Populating member list")
    var subgUsers = $scope.gidToNid[$scope.group.id];
    var clsUsers = $scope.gidToNid[$scope.group.props.parentid]
    if(subgUsers != undefined) {
      for(i = 0; i < subgUsers.length; i++) {
        nid = subgUsers[i];
        userObj = $scope.nidToUser[nid];
        userObj.netid = nid;
        console.log("Inserting " + nid);
        if(nid == $ref.netid) {
          $scope.newgroup.creatorid = userObj.netid;
          $scope.newgroup.creatorname = userObj.name;
          $scope.newgroup.classCode = $scope.group.props.classCode;
        }
        $scope.groupMembers.push(userObj);
      }

      console.log("Inserting done!");

      // There were more than one members
      if(i > 0)
        $scope.hasMembers = true;

      // Current user
      $scope.thisUser = $scope.nidToUser[$ref.netid];
      $scope.thisUser.netid = $ref.netid;
      console.log($scope.thisUser);

      // Find next group name
      $scope.getGroupName = function() {
        var sg = $scope.thisUser.classes[$scope.group.props.classCode]['subgroups']
        if(sg != undefined) {
          var size = getSize(sg);
          // console.log("Got name: Group " + size);
          return "Group " + size;
        }
        return "Group 1";
      }
      $scope.newgroup.name = $scope.getGroupName();
      $scope.newgroup.options = ['open', 'closed'];
      $scope.newgroup.type = 'open';
      $scope.newgroup.desc = 'Some Description(Optional)';
    }
    if(clsUsers != undefined) {
      for(i = 0; i < clsUsers.length; i++) {
        nid = clsUsers[i];
        userObj = $scope.nidToUser[nid];
        userObj.netid = nid
        if(nid == $ref.netid || ($scope.groupMembers.indexOf(userObj) != -1)) {
          continue
        }
        $scope.classMembers.push(userObj);
      }
    }
  }, 0);

  // Changes the name of the group
  $scope.newName = $scope.group.props.name;
  $scope.newType = $scope.group.props.type;
  console.log("Group type " + $scope.newType);

  var changeSubgroup = function(netid, newSubgroup, oldName, changeName) {
      console.log("Setting " + netid);
      var newName = $scope.newName.trim();
      newSubgroup.name = newName;
      newSubgroup.type = $scope.newType;
      if(changeName) {
        $timeout(function() {
          $ref.base.child('users/' + netid + '/classes/' + $scope.group.props.classCode + '/subgroups/' + newName).set(newSubgroup);
        }, 0);
        $timeout(function() {
          $ref.base.child('users/' + netid + '/classes/' + $scope.group.props.classCode + '/subgroups/' + oldName).remove();
        }, 0);
      } else {
        $timeout(function() {
          $ref.base.child('users/' + netid + '/classes/' + $scope.group.props.classCode + '/subgroups/' + oldName + '/type').set($scope.newType);
        }, 0);
      }
      console.log("Done setting group");
  }

  $scope.changeGroupAttr = function(atr) {
    console.log("Setting group to");
    
    var currentName = $scope.group.props.name;

    // Change the group's fb, Not working without timeout !!!
    $timeout(function() {
      $ref.base.child('groups/' + $scope.group.id + '/props/' + atr).set({'name':$scope.newName, 'type':$scope.newType}[atr]);
    }, 0);

    if(atr == 'name')
      $timeout(function() {
        console.log("Changing name under subgroup");
        $ref.base.child('groups/' + $scope.group.props.parentid + '/subgroups/' + $scope.group.id + "/name").set($scope.newName);
      }, 0);

    // Change attributes for every user
    for(i = 0; i < $scope.groupMembers.length; i++) {
      var subgroup = $scope.groupMembers[i]['classes'][$scope.group.props.classCode]['subgroups'][$scope.group.props.name];
      var nid = $scope.groupMembers[i].netid;
      console.log("Found nid " + i + " " + nid);
      changeSubgroup(nid, subgroup, currentName, atr == 'name');
    }
  }
  

  // Move a member to the selected list
  $scope.moveToNew = function(member) {  
    if($scope.selectedList.length == 0) {
      if(!$scope.isUserAdmin($scope.thisUser)) {
        $scope.selectedList.push($scope.thisUser);
        if(member == $scope.thisUser)
          return;
      }
    }
    $scope.selectedList.push(member);
    // console.log("Transfered " + member.netid);
  }

  // Remove member from list of selected mems
  $scope.removeFromList = function(member, list) {
    var ind = list.indexOf(member);
    list.splice(ind, 1);
  }


  // Remove a member from the group
  $scope.removeMember = function(member) {
    console.log("Removing " + member.netid + " from " + $scope.group.props.name + " of " + $scope.group.props.classCode);
    $timeout(function() {
      $ref.base.child('users/' + member.netid + '/classes/' + $scope.group.props.classCode + '/subgroups/' + $scope.group.props.name).remove();
    }, 0);
    $timeout(function() {
      $ref.base.child('users/' + member.netid + '/groups/' + $scope.group.id).remove();
    }, 0);
    $timeout(function() {
      $ref.base.child('groups/' + $scope.group.id + '/users/' + member.netid).remove();
    }, 0);

    // Remove from list of members in this scope
    $scope.removeFromList(member, $scope.groupMembers);

    // Add it to classmates list
    $scope.classMembers.push(member);
  }

  // Is the user admin of this group
  $scope.isUserAdmin = function(member) {
    if($scope.group.props.maingroup) {
      $scope.hasAdmin = false;
      return false
    } try {
      $scope.hasAdmin = member.classes[$scope.group.props.classCode]['subgroups'][$scope.group.props.name]['admin'];
    } catch(err) {
      console.log($scope.group.props.name);
      console.log("Error getting subgroup!");
      return $scope.hasAdmin;
    }
    return $scope.hasAdmin;
  }

  // Open confirmation modal
  $scope.confirm = function(member, action) {

    // Determine with message to show
    msg = "";
    if(action == 'remove')
      msg = "Are you sure you want to kick out " + member.name + "?";

    var modalInstance = $modal.open({
      templateUrl: 'removeClassModal.html',
      controller: removeMemberModalCtrl,
      resolve: {
        rmem: function() {
          return function() {
            $scope.removeMember(member);
          }
        },
        msg: function () {
          return msg;
        }
      }
    });
  }

  var removeMemberModalCtrl = function ($scope, $modalInstance, rmem, msg) {
    $scope.msg = msg;

    $scope.ok = function() {
     rmem();
     $modalInstance.close();
    }

    $scope.cancel = function() {
     $modalInstance.dismiss('cancel');
    }
  }

  // console.log($scope.newgroup)

  // Add new member to the group
  $scope.addToGroup = function(newgroup, netid, isAdmin) {

    console.log("New group " + newgroup.name + " " + newgroup.creatorid + " for " + netid);

    // Push this member to the new group
    $timeout(function() {
      $ref.base.child('groups/' + newgroup.id +'/users/' + netid).set({
        netid: netid
      });
    }, 0);

    // Push new group to /groups of user
    $timeout(function() {
      $ref.base.child('users/' + netid + "/groups/" + newgroup.id).set({
        id: newgroup.id
      })
    }, 0);

    // Save the group under this user
    $timeout(function() {
      $ref.base.child('users/' + netid + '/classes/' + newgroup.classCode + '/subgroups/' + newgroup.name).set({
        name : newgroup.name,
        type : newgroup.type,
        creatorid : newgroup.creatorid,
        id : newgroup.id,
        admin : isAdmin
      });
    }, 0);

    return true;
  }

  // Saves new group to firebase
  $scope.newGroup = function() {
    if($scope.isNameValid($scope.newgroup.name, $scope.selectedList)) {
      // Get today's date
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      var todayDate = mm+'/'+dd+'/'+yyyy;
      
      $scope.newgroup.datecreated = todayDate;

      // Save the group to groups
      var pushref = $ref.base.child('groups/').push({
        props : {
          name : $scope.newgroup.name,
          datecreated : $scope.newgroup.datecreated,
          desc : $scope.newgroup.desc,
          creatorid : $scope.newgroup.creatorid,
          classCode : $scope.group.props.classCode,
          maingroup : false,
          type : $scope.newgroup.type,
          parentid : $scope.group.id
        }
      });

      // Get the id of the new group in firebase
      var newgroupId = pushref.name();
      $scope.newgroup.id = newgroupId;

      // Add this new group as subgroup of its parent
      $timeout(function(){
        $ref.base.child('groups/' + $scope.group.id + '/subgroups/' + newgroupId).set({
          name:$scope.newgroup.name,
          creatorid:$scope.newgroup.creatorid
        });
      }, 0);

      // Save the group under each member
      for(i = 0; i < $scope.selectedList.length; i++) {

        // Netid and admin
        var nid = $scope.selectedList[i].netid;

        var isAdmin = $scope.selectedList[i].isAdminNewGroup != undefined && $scope.selectedList[i].isAdminNewGroup
        if(nid == $ref.netid)
          isAdmin = true;
  
        $scope.addToGroup($scope.newgroup, nid, isAdmin);
      }

      // Append the new name to the recent list
      recentGroupNames.push($scope.newgroup.name);

      // Close the selected list
      $scope.selectedList = [];
    }
  }

  // Add member to group as long as this
  // group name is valid in user's space
  $scope.addMemberToGroup = function(member) {
    if(!member.showWarning) {
      $scope.addToGroup($scope.group, member.netid, false);
      $scope.groupMembers.push(member);
    }
  }

  // Makes a member admin
  $scope.changeAdmin = function(member, val) {
    console.log("Changing " + member.netid + " admin to " + val);
    $timeout(function() {
      $ref.base.child('users/' + member.netid + '/classes/' + $scope.group.props.classCode + '/subgroups/' + $scope.group.props.name + '/admin').set(val);
    }, 0);
  }

  // Checks if name does not exist as subgroup of
  // user's groups
  $scope.isnameValidInUser = function(user, name) {
    try {
      if(user.classes[$scope.group.props.classCode].subgroups != undefined)
        if(user.classes[$scope.group.props.classCode].subgroups[name] != undefined) {
          return false;
      }
      return true;
    } catch(err) {
      console.log("Error getting user");
      return false;
    }
  }

  // Checks if the group name is valid for every user
  // in list
  $scope.isNameValid = function(newName, list) {
    
    // Special case if newName is same as group name
    if(list == $scope.groupMembers && newName == $scope.group.props.name) {
      return true;
    }

    // Check it has not been used recently
    if(recentGroupNames.length != 0 &&
        recentGroupNames.indexOf(newName) != -1) {
      return false;
    }

    // Go through every user's groups and detect
    // group names
    for(i = 0; i < list.length; i++) {
      user = list[i];
      if(!$scope.isnameValidInUser(user, newName))
        return false;
    }
    // console.log("Nothing found");
    return true;
  }

  // Gets the size of an object
  getSize = function(obj) {
      var size = 0;
      var key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size + 1;
  }

})
