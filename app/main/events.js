angular.module("app.events", ['app.auth', 'ui.keypress', 'app.extendui'])


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
  $scope.showInfo = function(opts) {
    opts.details = !opts.details;
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
