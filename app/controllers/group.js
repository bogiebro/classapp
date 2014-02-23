angular.module("app.group", ['app.auth'])

.controller('GroupCtrl', function ($scope, $location, $group) {
    $scope.goAfam = function() {
        $group.setGroup('-JGUGGyk0SZimiNxsJQU');
    }

    $scope.goCpsc = function() {
        $group.setGroup('-JGUGyVuGopq8R85ReW5');
    }
})