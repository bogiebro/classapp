window.App = angular.module("App", ['ui.bootstrap', 'ui.bootstrap.tpls', 'app.group',
    'ngRoute', 'firebase', 'app.main.templates', 'ezfb', 'angularFileUpload', 'ngCookies',
    'app.auth', 'app.bigevents', 'app.help', 'app.chat', 'app.members', 'app.events', 'app.files'])

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: $PROCESS_ENV_FBID)
    $routeProvider
        .when('/chat', {controller:'ChatCtrl', templateUrl:'app/main/chat.jade'})
        .when('/members', {controller:'MembersCtrl', templateUrl:'app/main/members.jade'})
        .when('/files', {controller:'FilesCtrl', templateUrl:'app/main/files.jade'})
        .when('/help', {controller:'HelpCtrl', templateUrl:'app/main/help.jade'})
        .when('/bigevents', {controller:'BigEventsCtrl', templateUrl:'app/main/bigevents.jade'})
        .otherwise({redirectTo: '/bigevents'})

.controller 'InfoCtrl', ($scope, $modalInstance, $FB, $ref, $http, $upload, $firebase)->
    
    # configure basic fields for manual text entry
    $scope.me = {}
    $firebase($ref.base.child("users/#{$ref.netid}/name")).$bind($scope, "me.name")
    $firebase($ref.base.child("users/#{$ref.netid}/college")).$bind($scope, "me.college")

    # facebook integration
    fillFBData = (token)->
      console.log('filling data')
      $http.post('/extendToken', {token: token, netid: $ref.netid})
      api <- $FB.api('/me?fields=id,name,picture')
      $ref.base.child("/users/#{$ref.netid}").update do
        fbid: api.id
        name: api.name
        image: api.picture.data.url
    $scope.fbLogin = ->
        console.log('got called')
        $FB.getLoginStatus (sres)->
          console.log(sres.status)
          if sres.status != 'connected'
            $FB.login(((res)->
                if (res.authResponse)
                  fillFBData(res.authResponse.accessToken)
            ), {})
          else fillFBData(sres.authResponse.accessToken)
    $scope.dismiss = !-> $modalInstance.close!

    # drag and drop image uploading with progress support
    $ref.base.child("/users/#{$ref.netid}/pic").once 'value' (snap)->
        $scope.me.image = snap.val!
    $scope.image = {}
    $scope.image.progress = 0
    $scope.onImgSelect = ($files)->
      console.log('hi there')
      if $scope.image.progress == 0
        $upload.upload(
          url: '/upload'
          method: 'POST'
          file: $files[0]
          fileFormDataName: 'myFile'
        ).then((response)->
          $scope.image.progress = 0
          $scope.me.image = "#{$PROCESS_ENV_S3URL}/pics/#{$ref.netid}.jpg" + '?a=' + new Date!.getTime!
        , null, (evt)->
          $scope.image.progress = parseInt(100.0 * evt.loaded / evt.total))

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

.controller 'MainCtrl', ($scope, $location, $group)!->
  $scope.group = $group.props
  $scope.big = false
  $scope.$on 'newuser', !-> $location.path('/help')
  $scope.$on '$locationChangeSuccess', !->
    if $location.path! is '/bigevents' then $scope.big = true else $scope.big = false

.controller 'NavCtrl', ($scope, $location, $group)!->
  $scope.clearGroup = $group.clearGroup
  $scope.group = $group.props
  $scope.go = (x)-> $location.path(x)
