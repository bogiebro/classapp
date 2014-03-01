angular.module("app.group", ['app.auth'])

.controller('GroupCtrl', function ($scope, $ref, $modal) {
    
	//get net id
    //$scope.netid = $ref.netid;
    //$scope.userData = $ref.me;
    $scope.allUserClasses = [{name : "CPSC 439", desc : "Software Engineering"},
    					 {name : "CPSC 490", desc : "Advanced Projects"}];
    $scope.newUserClassName = "";

    $scope.allClassInfo = []
    cChild = new Firebase("https://torid-fire-3655.firebaseio.com/classcodes/")
    cChild.on('value', function(snapshot){
    	alert("Found " + snapshot.val());
    	$scope.allClassInfo.push(snapshot.val());
    });


    //add classes
    $scope.addClasses = function() {
    	// userData.child('classes').set($scope.newClass.name);
    	$scope.allClasses.push({name : $scope.newClassName, desc : "Some Description"});
    };

    $scope.removeClass = function(element) {
    	index = $scope.allClasses.indexOf(element)
    	if(index != -1) {
    		alert("Removing " + index);
    		$scope.allClasses.splice(index, 1);
    	} else {
    		alert(index);
    	}
    }
})

.directive("manipulate", function(){
	var linker = function(scope, element, attr) {
		if(element.hasClass('addClassForm')) {
			element.bind('submit') , function() {
				alert("Add class?");
				element.find('input').val(function( i, val ) {
    				return '+ New Class';
  				});
			}
		}
		if(element.hasClass('oneClass')) {
			element.bind('click', function() {
		        element.toggleClass("tallClass");
		        var toolbar = element.find('.toolBarContainer').toggleClass('hiddenElement');
	      	});
		}
		else if(element.hasClass('collapseBtn')) {
			element.bind('click', function() {
				element.parent().parent().toggleClass("hiddenElement");
			});
		}
	}

	return {
		link: linker
	}
})





