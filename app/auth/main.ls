window.App = angular.module("App", ['ui.bootstrap', 'ui.bootstrap.tpls',
    'ngRoute', 'firebase', 'app.auth.templates', 'ezfb', 'ngCookies'])

.factory '$ref' ($cookies)->
    cookieData = JSON.parse($cookies.casInfo)
    firebase = new Firebase('https://torid-fire-3655.firebaseio.com')
    do
        error <- firebase.auth(cookieData.token)
        console.log("Login Failed!", error) if error
    return {base: firebase, netid: cookieData.netid}

.factory '$trackConnected' ($ref, $firebase)->
    myConnectionsRef = $ref.base.child "users/#{$ref.netid}/connections"
    connectedRef = $ref.base.child '.info/connected'
    connectedRef.on 'value' (snap)!->
        if (snap.val!)
            myConnectionsRef.push true
            con.onDisconnect!remove!
    return (netids)->
        obj = {}
        for netid in netids
            obj[netid] = $firebase($ref.base.child("users/#{netid}/connections"))
        return obj

.config ($routeProvider, $FBProvider)->
    $FBProvider.setInitParams(appId: '644243232277907')
    $routeProvider.
        when('/', {controller:'MainCtrl', templateUrl:'app/auth/main.jade'})

.controller 'InfoCtrl', ($scope, $modalInstance, $FB, me)->
    $scope.me = me
    $scope.fbLogin = ->
        $FB.login(((res)->
            if (res.authResponse)
                api <- $FB.api('/me')
                $scope.me <<< api
        ), {})
    $scope.dismiss = ->
        $modalInstance.close($scope.me)

.controller 'MainCtrl', ($firebase, $scope, $ref, $modal)->

    $scope.messages = $firebase($ref.base.child('groups/CPSC433/chats'))
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
