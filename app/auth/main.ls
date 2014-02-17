window.App = angular.module("App", ['ui.bootstrap', 'ui.bootstrap.tpls', 'app.group',
    'ngRoute', 'firebase', 'app.auth.templates', 'ezfb', 'omr.angularFileDnD',
    'app.auth', 'app.bigevents', 'app.help', 'app.chat', 'app.members', 'app.events', 'app.files'])

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: '644243232277907')
    $routeProvider
        .when('/', {controller:'MainCtrl', templateUrl:'app/auth/main.jade'})
        .when('/help', {controller:'HelpCtrl', templateUrl:'app/auth/help.jade'})
        .when('/bigevents', {controller:'BigEventsCtrl', templateUrl:'app/auth/bigevents.jade'})

.controller 'InfoCtrl', ($scope, $modalInstance, $FB, me)->
    $scope.me = me
    $scope.image = {}
    $scope.$watch('image.unscaled', (newval, oldval)!-> rescale(newval) if newval)
    rescale = (im)->
        data <- Resample(im, 50, 50)
        $scope.me.image = data
    $scope.fbLogin = ->
        $FB.login(((res)->
            if (res.authResponse)
                api <- $FB.api('/me')
                $scope.me <<< api
        ), {})
    $scope.dismiss = ->
        $modalInstance.close($scope.me)

.controller 'MainCtrl', ($firebase, $scope, $ref, $modal)->

    $scope.messages = $firebase($ref.base.child('groups/CPSC433/chat'))
    $scope.me = {}

    $scope.setupUser = ->
        $modal.open(
            templateUrl: 'askId'
            controller: 'InfoCtrl'
            resolve: {me: (-> $scope.me)}
        ).result.then (val)->
            $scope.me = val

    $scope.$on 'loggedin', ->
        $firebase($ref.base.child("users/#{$ref.netid}")).$bind($scope, "me").then (unbind)->
            $scope.setupUser! if not $scope.me.name?

    $scope.submit = ->
        $scope.messages.$add({netid: $ref.netid, body: $scope.message})
        $scope.message = ''
