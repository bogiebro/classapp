angular.module('app.color', [])

// get the color of the event at index i
.factory('$color', function () {
  //Testing with a more classy look
  // var colors = ['rgba(126,126,126, 0.8)', 'rgba(112,112,112, 0.8)'];
  //var colors = ['LightBlue', 'LightCyan', 'Plum', 'LavenderBlush', 'rgba(112,112,112, 0.8)', 'rgba(245, 245, 245, 0.4)'];
  var colors = ['LightBlue', 'LightCyan', 'rgba(245, 245, 245, 0.4)'];
  return function(i) {
    return colors[i % colors.length];
  };
})
