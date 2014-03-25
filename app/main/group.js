angular.module("app.group", ['app.auth', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'ui.bootstrap.tpls'])

.controller('GroupCtrl', function ($scope, $http, $ref, $location, $firebase, $group) {
 
  // Contains all user input
  $scope.model = {};
  
  // Capture the current group
  $scope.group = $group.props;

  // Bind to the classes
  $scope.myclasses = $firebase($ref.base.child('users/' + $ref.netid + '/classes'));
  $scope.showHelpText = false;
  $scope.myclasses.$on('change', function() {
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
    $http.post('/joinGroup/sharedClasses/' + model.maingroup);
    $scope.changeGroup(model.maingroup);
  }
  
  // Set the group to what the user clicks on
  $scope.changeGroup = function(gid) {
    $group.setGroup(gid);
    $location.path('/members');
  }
})
