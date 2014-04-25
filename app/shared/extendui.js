angular.module('app.extendui', [])

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
