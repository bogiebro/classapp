window.App = angular.module("App", ['ui.bootstrap', 'ui.bootstrap.tpls', 'app.group',
    'ngRoute', 'firebase', 'app.main.templates', 'ezfb', 'omr.angularFileDnD', 'ngCookies',
    'app.auth', 'app.bigevents', 'app.help', 'app.chat', 'app.members', 'app.events', 'app.files'])

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: $PROCESS_ENV_FBID)
    $routeProvider
        .when('/chat', {controller:'ChatCtrl', templateUrl:'app/main/chat.jade'})
        .when('/members', {controller:'MembersCtrl', templateUrl:'app/main/members.jade'})
        .when('/files', {controller:'FilesCtrl', templateUrl:'app/main/files.jade'})
        .when('/help', {controller:'HelpCtrl', templateUrl:'app/main/help.jade'})
        .when('/bigevents', {controller:'BigEventsCtrl', templateUrl:'app/main/bigevents.jade'})
        .otherwise({redirectTo: '/members'})

.controller 'InfoCtrl', ($scope, $modalInstance, $FB, $ref, $http)->
    $scope.me = $ref.me
    $scope.image = {}
    $scope.$watch('image.unscaled', (newval, oldval)!-> rescale(newval) if newval)
    rescale = (im)->
        data <- Resample(im, 50, 50)
        $ref.me.image = data
    fillFBData = (token)->
      $http.post('/extendToken', {token: token, netid: $ref.netid})
      api <- $FB.api('/me?fields=id,name,picture')
      $ref.me <<< api
    $scope.fbLogin = ->
        $FB.getLoginStatus (sres)->
          if sres.status != 'connected'
            $FB.login(((res)->
                if (res.authResponse)
                    fillFBData(res.authResponse.accessToken)
            ), {})
          else fillFBData(sres.authResponse.accessToken)
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
  $scope.loc = {path: !-> console.log('hi')}
  $scope.big = false
  $scope.$on 'newuser', !-> $location.path('/help')
  $scope.$on '$locationChangeSuccess', !->
    if $location.path! is '/bigevents' then $scope.big = true else $scope.big = false

.controller 'NavCtrl', ($scope, $location)!->
  $scope.go = (x)-> $location.path(x)
