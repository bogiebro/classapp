angular.module('app.color', [])

// get the color of the event at index i
.factory('$color', function () {
  var colors = ['LightBlue', 'LightCyan', 'Plum', 'LavenderBlush', '', 'rgba(245, 245, 245, 0.4)'];
  return function(i) {
    return colors[i % colors.length];
  };
})
