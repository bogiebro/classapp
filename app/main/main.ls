window.App = angular.module("App", ['ui.bootstrap', 'ui.bootstrap.tpls', 'app.group',
    'ngRoute', 'firebase', 'app.main.templates', 'ezfb', 'omr.angularFileDnD', 'ngCookies',
    'app.auth', 'app.bigevents', 'app.help', 'app.chat', 'app.members', 'app.events', 'app.files'])

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: $PROCESS_ENV_FACEBOOK)
    $routeProvider
        .when('/', {controller:'MainCtrl', templateUrl:'app/main/main.jade'})
        .when('/help', {controller:'HelpCtrl', templateUrl:'app/main/help.jade'})
        .when('/bigevents', {controller:'BigEventsCtrl', templateUrl:'app/main/bigevents.jade'})

.controller 'InfoCtrl', ($scope, $modalInstance, $FB, $ref)->
    $scope.me = $ref.me
    $scope.image = {}
    $scope.$watch('image.unscaled', (newval, oldval)!-> rescale(newval) if newval)
    rescale = (im)->
        data <- Resample(im, 50, 50)
        $ref.me.image = data
    $scope.fbLogin = ->
        $FB.login(((res)->
            if (res.authResponse)
                api <- $FB.api('/me')
                $ref.me <<< api
        ), {})
    $scope.dismiss = !-> $modalInstance.close!

.controller 'AboutCtrl', ($scope, $modalInstance)->
    $scope.dismiss = !-> $modalInstance.close!

.controller 'PrefCtrl', ($firebase, $scope, $ref, $modal)->
    $scope.setupUser = ->
        $modal.open(
            templateUrl: 'askId'
            controller: 'InfoCtrl')
    $scope.$on 'newuser', !-> $scope.setupUser!
    $scope.about = ->
        $modal.open(
            templateUrl: 'aboutId'
            controller: 'AboutCtrl')

.controller 'MainCtrl', ($scope, $location)!->
    $scope.$on 'newuser', !-> $location.path('/help')
