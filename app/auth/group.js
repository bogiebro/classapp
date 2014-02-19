angular.module("app.group", ['app.auth'])

.controller('GroupCtrl', function ($scope, $location) {
    $scope.goBig = function() {
        $location.path('/bigevents');
    }
})