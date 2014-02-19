angular.module("app.bigevents", ['app.auth'])

.controller('BigEventsCtrl', function ($scope, $location) {
    $scope.goBack = function() {
        $location.path('/')
    }
})