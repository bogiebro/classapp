window.MobileApp = angular.module("MobileApp", ['ui.bootstrap', 'ui.bootstrap.tpls', 'app.group',
    'ngRoute', 'firebase', 'app.main.templates', 'ezfb', 'ngCookies',
    'app.auth', 'app.bigevents', 'app.help', 'app.chat', 'app.members', 'app.events', 'app.files'])

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: $PROCESS_ENV_FACEBOOK)
    $routeProvider
        .when('/', {controller:'GroupCtrl', templateUrl:'app/main/group.jade'})
        .when('/help', {controller:'HelpCtrl', templateUrl:'app/main/help.jade'})
        .when('/bigevents', {controller:'BigEventsCtrl', templateUrl:'app/main/bigevents.jade'})
        .when('/events', {controller:'BigEventsCtrl', templateUrl:'app/main/events.jade'})
        .when('/chat', {controller:'ChatCtrl', templateUrl:'app/main/chat.jade'})
        .when('/files', {controller:'FilesCtrl', templateUrl:'app/main/files.jade'})
        .when('/members', {controller:'MembersCtrl', templateUrl:'app/main/members.jade'})

.controller 'ToolbarCtrl', ($scope, $group, $location)->
    $scope.group = $group
    $scope.goEvents = -> $location.path('/events')
    $scope.goMembers = -> $location.path('/members')
    $scope.goChat = -> $location.path('/chat')
    $scope.goFiles = -> $location.path('/files')
