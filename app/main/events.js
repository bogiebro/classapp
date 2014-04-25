angular.module("app.events", ['app.auth', 'ui.keypress'])


.controller('EventsCtrl', function ($scope, $firebase, $group, $ref, $users, $timeout) {

  // track the current group's events
  $scope.group = $group.props;
  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (newvalue) {
      if ($scope.events) {
        $scope.events.$off();
      }
      $scope.events = $firebase($ref.base.child('groups/' +
          $group.props.id + '/events').startAt(new Date().getTime()));
    }
  });
    
  // create a new event
  $scope.newEvent = function () {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    var t = d.getTime();
    $scope.events.$add({message: 'New event', time: t}).then(function (r) {
      $scope.mostRecent = r.name();
      r.setPriority(t);
    });
  }

  // get the color of the event at index i
  var colors = ['LightBlue', 'LightCyan', 'Plum', 'LavenderBlush', '', 'rgba(245, 245, 245, 0.4)'];
  $scope.getColor = function(i) {
    return colors[i % colors.length];
  };

  // show a thing to join, see who else has joined. is it a spontanious group?
  $scope.showInfo = function() {
  };

  // edit the event text/ date
  $scope.editEvent = function(obj) {
    $scope.mostRecent = obj.$id;
  };
 
  // close the editing field
  $scope.closeMe = function(elem) {
    var newtime =  Date.fromString(elem.message).getTime();
    if (newtime > new Date().getTime()) {
      elem.time = newtime;
    }
    elem.$priority = elem.time;
    $scope.mostRecent = null;
    $scope.events.$save(elem.$id);
  };

})

.directive('syncFocusWith', function($timeout, $rootScope) {
    var timer;
    return {
        restrict: 'A',
        scope: {
            focusValue: "=syncFocusWith"
        },
        link: function($scope, $element, attrs) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(function() {
            if ($scope.focusValue) {
              $element[0].focus();
            }
          }, 0);
          $scope.$watch("focusValue", function(currentValue, previousValue) {
              if (currentValue === true && !previousValue) {
                  $element[0].focus();
              } else if (currentValue === false && previousValue) {
                  $element[0].blur();
              }
          });
        }
    }
})

.directive('sglclick', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var fn = $parse(attr['sglclick']);
          var delay = 300, clicks = 0, timer = null;
          element.on('click', function (event) {
            clicks++;  //count clicks
            if(clicks === 1) {
              timer = setTimeout(function() {
                scope.$apply(function () {
                    fn(scope, { $event: event });
                }); 
                clicks = 0;             //after action performed, reset counter
              }, delay);
              } else {
                clearTimeout(timer);    //prevent single-click action
                clicks = 0;             //after action performed, reset counter
              }
          });
        }
    };
}])
