angular.module("app.events", ['app.auth', 'ui.keypress', 'app.extendui', 'app.color', 'ui.bootstrap.tooltip'])

.controller('EventsCtrl', function ($scope, $firebase, $group, $color, $ref, $users, $timeout) {

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
    $scope.events.$add({message: 'New event', time: 'No time set'}).then(function (r) {
      $scope.mostRecent = r.name();
      r.setPriority('unknown');
    });
  }

  // Use standard colors
  $scope.getColor = $color;

  // check whether the current user is going
  $scope.checkGoing = function (eid, obj) {
    if ($scope.events[eid].users && $scope.events[eid].users[$ref.netid]) {
      obj.going = true;
    }
  }

  // add users to the event
  $scope.changeGoing = function (obj, opts, e) {
    if (!opts.going) {
      opts.going = true;
      $ref.base.child('groups/' + $group.props.id + '/events/' + obj.$id + '/users/' + $ref.netid).set($ref.netid);
    } else {
      opts.going = false;
      $ref.base.child('groups/' + $group.props.id + '/events/' + obj.$id + '/users/' + $ref.netid).remove();
    }
    e.stopPropagation();
  }
  
  // take the chat to the knot for this event
  $scope.showChat = function (obj) {
    console.log('do something here')
  }
  
  // track who's going
  $scope.userinfo = $users.users

  // toggle the expanded event view
  $scope.showInfo = function(opts) {
    opts.details = !opts.details;
  };

  // edit the event text/ date
  $scope.editEvent = function(obj) {
    $scope.mostRecent = obj.$id;
  };
 
  // close the editing field
  $scope.closeMe = function(elem) {
    var newtime =  Date.fromString(elem.message);
    console.log(newtime);
    var tsecs = newtime.getTime();
    if (tsecs > new Date().getTime()) {
      var m = moment(newtime);
      elem.time = moment().format('dddd MMM Do h:mm a');
      elem.$priority = tsecs;
    } else {
      elem.time = 'No time set';
      elem.$priority = 'unknown';
    }
    $scope.mostRecent = null;
    $scope.events.$save(elem.$id);
  };

})
