angular.module("app.group", ['app.auth', 'firebase'])

.controller('GroupCtrl', function ($scope, $group, $ref, $modal, $location, $http) {
  $scope.goEvents = function() {
    $group.setGroup('-JGUGGyk0SZimiNxsJQU')
    $location.path('/files')
  }
 
//  $scope.goBig = function() {
//      $location.path('/bigevents');
//  }
//
//  $scope.allClasses = [];
//  $scope.classLoadWaiting = true;
//    
//  // Get all class objects
//  $http.get('/classcodes.json').then(function(result) {
//    arr = []
//    for (var key in result.data) {
//      arr.push(result.data[key]);
//    }
//    $scope.allClasses = arr;
//    $scope.classLoadWaiting = false;
//  });
//  
//  $scope.user = $ref.me;
//  
//  var classSelected = function(value) {
//      return $scope.allClasses[value.code] == undefined
//  };
//
//  //add classes to list of user's classes
//  $scope.addClass = function(clickedClass) {
//    console.log("Adding class " + clickedClass.name)
//    try {
//        if($scope.user.classes == undefined ||
//           $scope.user.classes[clickedClass.code] == undefined) {
//          $ref.base.child("users/" + $ref.netid).child("/classes/" + clickedClass.code).set(clickedClass);
//          $ref.base.child("classcodes/" + clickedClass.code + "/members/" + $ref.netid).set({member : true});
//        } else console.log(clickedClass.code + " already added!");
//    } catch(err) {
//        console.log(err)
//    }
//  };
//
//  $scope.removeClass = function(clickedClass) {
//    console.log("Removing class " + clickedClass.code + " of " + $ref.netid)
//    $ref.base.child("users/" + $ref.netid).child("/classes/" + clickedClass.code).remove();
//  }
//
//  $scope.openRemoveClassModal = function(clickedClass) {
//
//        var modalInstance = $modal.open({
//            templateUrl: 'simpleModal.html',
//            controller: SimpleModalInstanceCtrl,
//            resolve: {
//                rclass: function() {
//                    return function() {
//                        $scope.removeClass(clickedClass);
//                    }
//                },
//                msg: function () {
//                    return "Are you sure you want to remove " + clickedClass.name + "?";
//                }
//            }
//        });
//    }
//
//    $scope.openAddGroupModal = function(clickedClass) {
//      $scope.classMembers = {name : "Sample1 Name1"};
//      var modalInstance = $modal.open({
//            templateUrl: 'groupModal.html',
//            controller: GroupModalInstanceCtrl,
//            resolve: {
//                msg: function () {
//                    return "Create a new study group for " + clickedClass.name;
//                }, 
//                members: function() {
//                    return $scope.classMembers;
//                }
//            }
//      });
//    }
//
//    var SimpleModalInstanceCtrl = function ($scope, $modalInstance, rclass, msg) {
//        $scope.msg = msg;
//
//        $scope.ok = function() {
//            rclass();
//            $modalInstance.close();
//        }
//
//        $scope.cancel = function() {
//            $modalInstance.dismiss('cancel');
//        }
//    }
//
//    var GroupModalInstanceCtrl = function ($scope, $modalInstance, msg, members) {
//        $scope.msg = msg;
//        $scope.classMembers = members;
//        $scope.newGroupMembers = [];
//        $scope.groupName = "Group 1";
//
//        $scope.addMemberToGroup = function(member) {
//            var index = -1;
//            for(i = 0; i < $scope.classMembers.length; i++) {
//                if($scope.classMembers[i].netid == member.netid) {
//                    index = i;
//                }
//            }
//            if(index != -1) {
//                $scope.newGroupMembers.push($scope.classMembers[index]);
//                $scope.classMembers.splice(index, 1);
//            } 
//
//        }
//
//        $scope.ok = function() {
//            $modalInstance.close();
//        }
//
//        $scope.cancel = function() {
//            $modalInstance.dismiss('cancel');
//        }
//    }
//
//
//
//  //   $scope.classExists = function(code) {
//  //    if($scope.allUserClasses == null)
//  //        return -1;
//        // for(i = 0; i < $scope.allUserClasses.length; i++) {
//        //  c = $scope.allUserClasses[i];
//        //  if(c.code == code)
//        //      return i;
//        // }
//        // return -1;
//  //   }
//
//})
//
//.directive("manipulate", function(){
//    var linker = function(scope, element, attr) {
//
//        // if(element.hasClass('suggestedClass')) {
//        //  element.click(function() {
//        //      console.log("Hiding div");
//        //      $('.suggestedClass').removeClass('blockDiv');
//        //      $('.addClassDiv').removeClass('tallClass');
//        //      $('.suggestedClass').addClass('noneDiv');
//        //  });
//        // }
//
//        if(element.hasClass('collapseBtn')) {
//            element.click(function() {
//        if($(".leftbar").css("width") == "60px") {
//          $(".leftbar").css("width", "15%");
//          element.removeClass("glyphicon-circle-arrow-right");
//          element.addClass("glyphicon-circle-arrow-left");
//        } else {
//                  $(".leftbar").css("width", "60px");
//          element.removeClass("glyphicon-circle-arrow-left");
//          element.addClass("glyphicon-circle-arrow-right");
//        }
//            });
//        }
//
//        // if(element.hasClass('liveSearch')) {
//        //  element.keyup(function(){
//        //      // $('.addClassDiv').addClass('tallClass')
//        //      var query = element.val().toLowerCase();
//        //      showDivs(element.attr('dataDiv'), query);
//
//        //      if(query == "") {
//        //          hideAllDivs('.suggestedClass');
//        //      }
//
//        //  });
//
//        //  showDivs = function(divclass, query) {
//        //      $(divclass).each(function() {
//        //          var classText = $(this).attr('id').toLowerCase();
//        //          if(classText.indexOf(query) != -1) {
//        //              $(this).removeClass('noneDiv');
//        //              $(this).addClass('blockDiv');
//        //          } else {
//        //              $(this).removeClass('blockDiv');
//        //              $(this).addClass('noneDiv');
//        //          }
//        //      });
//        //  }
//
//        //  hideAllDivs = function(divclass) {
//        //      $(divclass).removeClass('blockDiv');
//        //      //$(divclass).addClass('noneDiv');
//        //  }
//        // }
//        if(element.hasClass('oneClass')) {
//            element.click(function() {
//                // If already a tall class, make it short
//                if(element.hasClass('tallClass')) {
//                    console.log("Removing tall class!");
//                    element.removeClass('tallClass');
//                    element.find('.toolBarContainer').addClass('hiddenElement');
//
//                } else {
//                    // If not make everything else short
//                    $('.oneClass').removeClass('tallClass');
//                    $('.oneClass').find('.toolBarContainer').addClass('hiddenElement');
//                    
//                    // and then make this tall
//                    element.addClass("tallClass");
//                    element.find('.toolBarContainer').removeClass('hiddenElement');
//
//                }
//            });
//        }
//
//    }
//
//    return {
//        link: linker
//    }
})





