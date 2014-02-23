window.MobileApp = angular.module("MobileApp", ['ui.bootstrap', 'ui.bootstrap.tpls', 'app.group',
    'ngRoute', 'firebase', 'app.mobile.templates', 'ezfb', 'ngCookies',
    'app.auth', 'app.bigevents', 'app.help', 'app.chat', 'app.members', 'app.events', 'app.files'])

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: $PROCESS_ENV_FACEBOOK)
    $routeProvider
        .when('/', {controller:'GroupCtrl', templateUrl:'app/mobile/group.jade'})
        .when('/help', {controller:'HelpCtrl', templateUrl:'app/mobile/help.jade'})
        .when('/bigevents', {controller:'BigEventsCtrl', templateUrl:'app/mobile/bigevents.jade'})
        .when('/events', {controller:'BigEventsCtrl', templateUrl:'app/mobile/events.jade'})
        .when('/chat', {controller:'ChatCtrl', templateUrl:'app/mobile/chat.jade'})
        .when('/files', {controller:'FilesCtrl', templateUrl:'app/mobile/files.jade'})
        .when('/members', {controller:'MembersCtrl', templateUrl:'app/mobile/members.jade'})

.controller 'ToolbarCtrl', ($scope, $group)->
    $scope.group = $group
