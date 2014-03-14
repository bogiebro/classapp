angular.module("app.group", ['app.auth', 'firebase'])

.controller('GroupCtrl', function ($scope, $ref, $modal, $location, $firebase) {
 
  $scope.goBig = function() {
      $location.path('/bigevents');
  }

  // Bind the head of firebase
  $scope.data = $firebase(new Firebase('https://torid-fire-3655.firebaseio.com/'));

  $scope.data.$on('loaded', start);
  $scope.data.$on('change', check);

  // array of classes
  $scope.allClasses = new Array();

  // Boolean to indicate loading class has finished
  $scope.classLoadWaiting = true;

  // Live search object
  $scope.searchText = new Object();
  $scope.searchText.txt = '';

  // Group highlighting
  $scope.highlight = false;

  // Function to close the search suggestions
  $scope.closeClassList = function(strg) {
    strg.txt = '';
  }

  // Util function to update firebase obj
  setFB = function(url, value) {
    $firebase($ref.base.child(url)).$set(value);
  }

  // Util function to remove firebase obj
  removeFB = function(url) {
    $firebase($ref.base.child(url)).$remove();
  }

  // Add a class to the user's profile
  $scope.addClass = function(clickedClass) {
   console.log("Adding class " + clickedClass.name);

   // If the class has not been added
   if($scope.user.classes == undefined ||
     $scope.user.classes[clickedClass.code] == undefined) {

      // Add the class to the user's fb
      setFB('users/' + $ref.netid + '/classes/' + clickedClass.code,
          {name:clickedClass.name, code:clickedClass.code, prof:clickedClass.prof});

      // Add the user to the class fb
      setFB('classcodes/' + clickedClass.code + '/members/' + $ref.netid,
          {member: true});

      // Clear the search
      $scope.searchText.txt = '';
    }

    else
      console.log(clickedClass.code + " already added!");
  };

  // Removes class from the user profile
  $scope.removeClass = function(clickedClass) {
   console.log("Removing class " + clickedClass.code + " of " + $ref.netid)

   // Remove the class from user
   removeFB("users/" + $ref.netid + "/classes/" + clickedClass.code);

   // Remove user from class
   removeFB("classcodes/" + clickedClass.code + "/members/" + $ref.netid);
 }

  // Load initial data
  function start() {
    // load classes into array
    for(obj in $scope.data['classcodes']) {
      $scope.allClasses.push($scope.data['classcodes'][obj]);
    }

    $scope.classLoadWaiting = false;

    $scope.user = $scope.data.users[$ref.netid];
  }

  function check() {
    $scope.user = $scope.data.users[$ref.netid];
  }

  // to toggle between highlighted groups
  $scope.highlighted = new Object();
  $scope.highlighted.value = '';

  // Load modal window for deleting class
  $scope.openRemoveClassModal = function(clickedClass) {
    var modalInstance = $modal.open({
        templateUrl: 'simpleModal.html',
        controller: SimpleModalInstanceCtrl,
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

  // The actual confirmation modal
  var SimpleModalInstanceCtrl = function ($scope, $modalInstance, rclass, msg) {
    $scope.msg = msg;

    $scope.ok = function() {
     rclass();
     $modalInstance.close();
    }

    $scope.cancel = function() {
     $modalInstance.dismiss('cancel');
    }
  }

  // Open modal for creating groups
  $scope.openAddGroupModal = function(clickedClass) {

    var members = $scope.data.classcodes[clickedClass.code]['members'];
    var classMembers = new Array();

    // Determine what number this group is
    var groups = $scope.data.users[$ref.netid]['classes'][clickedClass.code]['groups'];
    var groupNum = 0;
    if(groups != undefined)
      groupNum = Object.keys(groups).length + 1;

    for(i = 0; i < Object.keys(members).length; i++) {
      var nid = Object.keys(members)[i];

      // Skip this user
      if(nid == $ref.netid)
        continue;

      var obj = $scope.data.users[nid];
      obj.netid = nid;
      classMembers.push(obj);
    }

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
        }
      }
    });
  }

  // The group creation modal
  var GroupModalInstanceCtrl = function ($scope, $modalInstance, msg, members, classCode, groupNum) {
    $scope.msg = msg;
    $scope.newGroupMembers = [];
    $scope.classMembers = members;
    $scope.group = new Object();

    $scope.group.name = 'Group ' + groupNum;
    $scope.group.options = ['open', 'closed']
    $scope.group.type = 'open';
    $scope.group.desc = 'Some Description(Optional)';

    $scope.ok = function() {
      console.log($scope.newGroupMembers);

      // Create the group in firebase
      setFB("users/" + $ref.netid + "/classes/" + classCode + "/groups/" + $scope.group.name,
          {name:$scope.group.name, type:$scope.group.type, desc:$scope.group.desc});

      // Add the members to the group
      for(i = 0; i < $scope.newGroupMembers.length; i++) {
        setFB("users/" + $ref.netid + "/classes/" + classCode + 
              "/groups/" + $scope.group.name + "/members/" + $scope.newGroupMembers[i].netid,
              {member:true});
      }
     $modalInstance.close();
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
  }

})


.directive("manipulate", function(){
    var linker = function(scope, element, attr) {


        if(element.hasClass('collapseBtn')) {
            element.click(function() {
        if($(".leftbar").css("width") == "60px") {
          $(".leftbar").css("width", "15%");
          $(".oneClass a").show();
          element.removeClass("glyphicon-circle-arrow-right");
          element.addClass("glyphicon-circle-arrow-left");
        } else {
                  $(".leftbar").css("width", "60px");
          $(".oneClass a").hide();
          $(".oneClass .list-group-item-heading").show();
          element.removeClass("glyphicon-circle-arrow-left");
          element.addClass("glyphicon-circle-arrow-right");
        }
            });
        }

        if(element.hasClass('oneClassHeading')) {
            element.click(function() {
                // If already a tall class, make it short
                if(element.parent().hasClass('tallClass')) {
                    console.log("Removing tall class!");
                    element.parent().removeClass('tallClass');
                    element.parent().find('.toolBarContainer').addClass('hiddenElement');

                } else {
                    // If not make everything else short
                    $('.oneClass').removeClass('tallClass');
                      $('.oneClass').find('.toolBarContainer').addClass('hiddenElement');
                    
                    // and then make this tall
                    element.parent().addClass("tallClass");
                    element.parent().find('.toolBarContainer').removeClass('hiddenElement');

                }
      });
        }

    }

    return {
        link: linker
    }
})





