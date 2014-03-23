angular.module("app.group", ['app.auth', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'ui.bootstrap.tpls'])

.controller('GroupCtrl', function ($scope, $http, $ref, $location, $firebase, $group, $modal) {
 
  // Contains all user input
  $scope.model = {};
  
  // Capture the current group
  $scope.group = $group.props;

  // Bind to the classes
  $scope.myclasses = $firebase($ref.base.child('users/' + $ref.netid + '/classes'));
  $scope.myclasses.$on('change', function() {
    console.log('Classes changed');
    if ($scope.myclasses.$getIndex().length == 0) {
      $scope.showHelpText = true;
    } else {
      $scope.showHelpText = false;
    }
  });

  // Link to big events view
  $scope.goBig = function() {
    $location.path('/bigevents');
  }
 
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
    $ref.base.child('group/' + model.maingroup + '/users').push($ref.netid);
    $ref.base.child('users/' + $ref.netid + '/groups').push(model.maingroup);
  }
  
  // Set the group to what the user clicks on
  $scope.changeGroup = function(gid) {
    $group.setGroup(gid);
  }


  $scope.openRemoveClassModal = function(clickedClass) {
      var modalInstance = $modal.open({
          templateUrl: 'removeClassModal.html',
          controller: removeClassModalInstanceCtrl,
          resolve: {
            rclass: function() {
              return function() {
                $scope.removeClass(clickedClass);
              }
            },
            msg: function () {
                return "Are you sure you want to remove " + clickedClass.name + "?";
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

   $scope.removeClass = function(clickedClass) {
     console.log("Removing class " + clickedClass.code + " of " + $ref.netid)
     // Remove the class from user
     // $ref.base.child("users/" + $ref.netid + "/classes/" + clickedClass.code)
  }

  $scope.openAddGroupModal = function(clickedClass) {

    classMembers = [];
    groupNum = 0;
    nonAvailNames = [];
    studentName = "Student Name";

    var modalInstance = $modal.open({
      templateUrl: 'groupModal.html',
      controller: GroupModalInstanceCtrl,
      resolve: {
        msg: function () {
          return "Create a new study group for " + clickedClass.code;
        }, 
        members: function() {
          return classMembers;
        },
        classCode: function() {
          return clickedClass.code;
        },
        groupNum: function() {
          return groupNum;
        },
        nonAvailNames : function() {
          return nonAvailNames;
        },
        studentName : function() {
          return studentName;
        }
      }
    });
  }

  // The group creation modal
  var GroupModalInstanceCtrl = function ($scope, $modalInstance, msg, members, classCode, groupNum, nonAvailNames, studentName) {
    $scope.msg = msg;
    $scope.newGroupMembers = [];
    $scope.classMembers = members;
    $scope.group = new Object();

    $scope.group.name = 'Group ' + groupNum;
    $scope.group.options = ['open', 'closed']
    $scope.group.type = 'open';
    $scope.group.desc = 'Some Description(Optional)';
    $scope.nonAvailNames = nonAvailNames;

    $scope.ok = function() {
      console.log($scope.newGroupMembers);
      if($scope.nonAvailNames.indexOf($scope.group.name) == -1) {
        // Get today's data
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        var todayDate = mm+'/'+dd+'/'+yyyy;
        var groupCreator = studentName + "(" + $ref.netid + ")";

        // Create the group under the class
        setFB("classcodes/" + classCode + "/groups/" + $scope.group.name,
            {name:$scope.group.name, 
             type:$scope.group.type, 
             desc:$scope.group.desc, 
             size:$scope.newGroupMembers.length,
             date:todayDate,
             creator:groupCreator});

        // Add the members to the group
        for(i = 0; i < $scope.newGroupMembers.length; i++) {
          setFB("classcodes/" + classCode + "/groups/" + $scope.group.name +
                "/members/" + $scope.newGroupMembers[i].netid,
                {member:true, name:$scope.newGroupMembers[i].name});
        }

        // Create the group name under the user
        setFB("users/" + $ref.netid + "/classes/" + classCode + "/groups/" + $scope.group.name,
            {name:$scope.group.name});

       $modalInstance.close();
     }
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }

    var transferMember = function(from, to, member) {
      console.log("Transfering " + member.netid + 'of group ' + $scope.group.name);
      to.push(member);
      var ind = from.indexOf(member);
      from.splice(ind, 1);
    }

    $scope.addMemberToGroup = function(member) {
      transferMember($scope.classMembers, $scope.newGroupMembers, member);
    }

    $scope.removeGroupMember = function(member) {
      transferMember($scope.newGroupMembers, $scope.classMembers, member);
    }
    $scope.isNameValid = function(name) {
      return $scope.nonAvailNames.indexOf(name) != -1 ? 'invalidInput' : undefined
    }
  }

  // Group search modal
  $scope.openSearchGroupModal = function(clickedClass) {

    // All groups under this class
    var groupArr = new Array();
    var groups = [];
    for(g in groups) {
      groupArr.push(groups[g]);
    }

    var modalInstance = $modal.open({
      templateUrl: 'searchGroupModal.html',
      controller: GroupSearchModalInstanceCtrl,
      resolve: {
        msg: function () {
          return "Search groups in " + clickedClass.code;
        },
        classCode: function() {
          return clickedClass.code;
        }, 
        groups: function() {
          return groupArr;
        }
       }
    });

  }

  // The group creation modal
  var GroupSearchModalInstanceCtrl = function ($scope, $modalInstance, msg, classCode, groups) {
    console.log('Passed groups ' + groups);
    $scope.groups = groups;
    $scope.msg = msg;
    $scope.groupTypeOptions = ['open', 'closed'];
    $scope.groupType = 'open';
    $scope.groupSizeOptions = ['small', 'medium', 'large'];
    $scope.groupSize = 'small';

    $scope.ok = function() {
      $modalInstance.dismiss();
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    }
  }

});





// angular.module("app.group", ['app.auth', 'firebase'])

// .controller('GroupCtrl', function ($scope, $ref, $modal, $location, $firebase) {
 
//   $scope.goBig = function() {
//       $location.path('/bigevents');
//   }

//   // Bind the head of firebase
//   $scope.data = $firebase(new Firebase('https://torid-fire-3655.firebaseio.com/'));

//   $scope.data.$on('loaded', start);
//   $scope.data.$on('change', check);

//   // array of classes
//   $scope.allClasses = new Array();

//   // Boolean to indicate loading class has finished
//   $scope.classLoadWaiting = true;

//   // Live search object
//   $scope.searchText = new Object();
//   $scope.searchText.txt = '';

//   // Function to close the search suggestions
//   $scope.closeClassList = function(strg) {
//     strg.txt = '';
//   }

//   // Util function to update firebase obj
//   setFB = function(url, value) {
//     $firebase($ref.base.child(url)).$set(value);
//   }

//   // Util function to remove firebase obj
//   removeFB = function(url) {
//     $firebase($ref.base.child(url)).$remove();
//   }

//   // Add a class to the user's profile
//   $scope.addClass = function(clickedClass) {
//    console.log("Adding class " + clickedClass.name);

//    // If the class has not been added
//    if($scope.user.classes == undefined ||
//      $scope.user.classes[clickedClass.code] == undefined) {

//       // Add the class to the user's fb
//       setFB('users/' + $ref.netid + '/classes/' + clickedClass.code,
//           {name:clickedClass.name, code:clickedClass.code, prof:clickedClass.prof});

//       // Add the user to the class fb
//       setFB('classcodes/' + clickedClass.code + '/members/' + $ref.netid,
//           {member: true});

//       // Clear the search
//       $scope.searchText.txt = '';
//     }

//     else
//       console.log(clickedClass.code + " already added!");
//   };

//   // Removes class from the user profile
//   $scope.removeClass = function(clickedClass) {
//    console.log("Removing class " + clickedClass.code + " of " + $ref.netid)

//    // Remove the class from user
//    removeFB("users/" + $ref.netid + "/classes/" + clickedClass.code);

//    // Remove user from class
//    removeFB("classcodes/" + clickedClass.code + "/members/" + $ref.netid);
//  }

//   // Load initial data
//   function start() {
//     // load classes into array
//     for(obj in $scope.data['classcodes']) {
//       $scope.allClasses.push($scope.data['classcodes'][obj]);
//     }

//     $scope.classLoadWaiting = false;

//     $scope.user = $scope.data.users[$ref.netid];
//   }

//   function check() {
//     $scope.user = $scope.data.users[$ref.netid];
//   }

//   // to toggle between highlighted groups
//   $scope.selectedGroup = null;
//   $scope.selectGroup = function(group) {
//     $scope.selectedGroup = group;
//   }
//   $scope.groupClass = function(group) {
//     return group == $scope.selectedGroup ? 'activeGroup' : undefined;
//   }

//   // Load modal window for deleting class
//   $scope.openRemoveClassModal = function(clickedClass) {
//     var modalInstance = $modal.open({
//         templateUrl: 'simpleModal.html',
//         controller: SimpleModalInstanceCtrl,
//         resolve: {
//           rclass: function() {
//             return function() {
//               $scope.removeClass(clickedClass);
//             }
//           },
//           msg: function () {
//               return "Are you sure you want to remove " + clickedClass.name + "?";
//           }
//         }
//     });
//   }

//   // The actual confirmation modal
//   var SimpleModalInstanceCtrl = function ($scope, $modalInstance, rclass, msg) {
//     $scope.msg = msg;

//     $scope.ok = function() {
//      rclass();
//      $modalInstance.close();
//     }

//     $scope.cancel = function() {
//      $modalInstance.dismiss('cancel');
//     }
//   }

//   // Open modal for creating groups
//   $scope.openAddGroupModal = function(clickedClass) {

//     // Get members of the class
//     var members = $scope.data.classcodes[clickedClass.code]['members'];
//     var classMembers = new Array();

//     // Determine what number this group is in the class
//     var groups = $scope.data.classcodes[clickedClass.code]['groups'];
//     var groupNum = 0;
//     if(groups != undefined)
//       groupNum = Object.keys(groups).length + 1;

//     // Get list of unavailable names
//     var nonAvailNames = new Array();
//     for(key in groups){
//       console.log('Group name ' + key)
//       nonAvailNames.push(key)
//     }

//     for(i = 0; i < Object.keys(members).length; i++) {
//       var nid = Object.keys(members)[i];

//       // Skip this user
//       if(nid == $ref.netid)
//         continue;

//       var obj = $scope.data.users[nid];
//       obj.netid = nid;
//       classMembers.push(obj);
//     }

//     var modalInstance = $modal.open({
//       templateUrl: 'groupModal.html',
//       controller: GroupModalInstanceCtrl,
//       resolve: {
//         msg: function () {
//           return "Create a new study group for " + clickedClass.code;
//         }, 
//         members: function() {
//           return classMembers;
//         },
//         classCode: function() {
//           return clickedClass.code;
//         },
//         groupNum: function() {
//           return groupNum;
//         },
//         nonAvailNames : function() {
//           return nonAvailNames;
//         },
//         studentName : function() {
//           return $scope.data.users[$ref.netid]['name'];
//         }
//       }
//     });
//   }

//   // The group creation modal
//   var GroupModalInstanceCtrl = function ($scope, $modalInstance, msg, members, classCode, groupNum, nonAvailNames, studentName) {
//     $scope.msg = msg;
//     $scope.newGroupMembers = [];
//     $scope.classMembers = members;
//     $scope.group = new Object();

//     $scope.group.name = 'Group ' + groupNum;
//     $scope.group.options = ['open', 'closed']
//     $scope.group.type = 'open';
//     $scope.group.desc = 'Some Description(Optional)';
//     $scope.nonAvailNames = nonAvailNames;
//     console.log('Non avail names ' + $scope.nonAvailNames)

//     $scope.ok = function() {
//       console.log($scope.newGroupMembers);
//       if($scope.nonAvailNames.indexOf($scope.group.name) == -1) {
//         // Get today's data
//         var today = new Date();
//         var dd = today.getDate();
//         var mm = today.getMonth()+1;
//         var yyyy = today.getFullYear();
//         var todayDate = mm+'/'+dd+'/'+yyyy;
//         var groupCreator = studentName + "(" + $ref.netid + ")";

//         // Create the group under the class
//         setFB("classcodes/" + classCode + "/groups/" + $scope.group.name,
//             {name:$scope.group.name, 
//              type:$scope.group.type, 
//              desc:$scope.group.desc, 
//              size:$scope.newGroupMembers.length,
//              date:todayDate,
//              creator:groupCreator});

//         // Add the members to the group
//         for(i = 0; i < $scope.newGroupMembers.length; i++) {
//           setFB("classcodes/" + classCode + "/groups/" + $scope.group.name +
//                 "/members/" + $scope.newGroupMembers[i].netid,
//                 {member:true, name:$scope.newGroupMembers[i].name});
//         }

//         // Create the group name under the user
//         setFB("users/" + $ref.netid + "/classes/" + classCode + "/groups/" + $scope.group.name,
//             {name:$scope.group.name});

//        $modalInstance.close();
//      }
//     }

//     $scope.cancel = function() {
//       $modalInstance.dismiss();
//     }

//     var transferMember = function(from, to, member) {
//       console.log("Transfering " + member.netid + 'of group ' + $scope.group.name);
//       to.push(member);
//       var ind = from.indexOf(member);
//       from.splice(ind, 1);
//     }

//     $scope.addMemberToGroup = function(member) {
//       transferMember($scope.classMembers, $scope.newGroupMembers, member);
//     }

//     $scope.removeGroupMember = function(member) {
//       transferMember($scope.newGroupMembers, $scope.classMembers, member);
//     }
//     $scope.isNameValid = function(name) {
//       return $scope.nonAvailNames.indexOf(name) != -1 ? 'invalidInput' : undefined
//     }
//   }

//   // Group search modal
//   $scope.openSearchGroupModal = function(clickedClass) {

//     // All groups under this class
//     var groupArr = new Array();
//     var groups = $scope.data.classcodes[clickedClass.code]['groups'];
//     for(g in groups) {
//       groupArr.push(groups[g]);
//     }

//     var modalInstance = $modal.open({
//       templateUrl: 'searchGroupModal.html',
//       controller: GroupSearchModalInstanceCtrl,
//       resolve: {
//         msg: function () {
//           return "Search groups in " + clickedClass.code;
//         },
//         classCode: function() {
//           return clickedClass.code;
//         }, 
//         groups: function() {
//           return groupArr;
//         }
//        }
//     });

//   }

//   // The group creation modal
//   var GroupSearchModalInstanceCtrl = function ($scope, $modalInstance, msg, classCode, groups) {
//     console.log('Passed groups ' + groups);
//     $scope.groups = groups;
//     $scope.msg = msg;
//     $scope.groupTypeOptions = ['open', 'closed'];
//     $scope.groupType = 'open';
//     $scope.groupSizeOptions = ['small', 'medium', 'large'];
//     $scope.groupSize = 'small';

//     $scope.ok = function() {
//       $modalInstance.dismiss();
//     }

//     $scope.cancel = function() {
//       $modalInstance.dismiss();
//     }


//   }

// })

// //   // Open modal for creating group

// // })


// .directive("manipulate", function(){
//     var linker = function(scope, element, attr) {


//         if(element.hasClass('collapseBtn')) {
//             element.click(function() {
//         if($(".leftbar").css("width") == "60px") {
//           $(".leftbar").css("width", "15%");
//           $(".oneClass a").show();
//           element.removeClass("glyphicon-circle-arrow-right");
//           element.addClass("glyphicon-circle-arrow-left");
//         } else {
//                   $(".leftbar").css("width", "60px");
//           $(".oneClass a").hide();
//           $(".oneClass .list-group-item-heading").show();
//           element.removeClass("glyphicon-circle-arrow-left");
//           element.addClass("glyphicon-circle-arrow-right");
//         }
//             });
//         }

//         if(element.hasClass('oneClassHeading')) {
//             element.click(function() {
//                 // If already a tall class, make it short
//                 if(element.parent().hasClass('tallClass')) {
//                     console.log("Removing tall class!");
//                     element.parent().removeClass('tallClass');
//                     element.parent().find('.toolBarContainer').addClass('hiddenElement');

//                 } else {
//                     // If not make everything else short
//                     $('.oneClass').removeClass('tallClass');
//                       $('.oneClass').find('.toolBarContainer').addClass('hiddenElement');
                    
//                     // and then make this tall
//                     element.parent().addClass("tallClass");
//                     element.parent().find('.toolBarContainer').removeClass('hiddenElement');

//                 }
//       });
//         }

//     }

//     return {
//         link: linker
//     }
// })





