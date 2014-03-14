angular.module("app.help", ['app.auth'])

.controller('HelpCtrl', function ($scope, $location) {
    $scope.done = function () { $location.path('/')}
})