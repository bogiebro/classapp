angular.module("app.events", ['app.auth'])

.controller('EventsCtrl', function ($scope, $group) {
    $scope.group = $group.props;
    // $scope.$watch('state', function (newval, oldval) {
    //     console.log(newval)});
})