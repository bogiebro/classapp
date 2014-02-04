angular.module("classapp", ['ui.bootstrap', 'ui.bootstrap.tpls',
    'ngRoute', 'firebase', 'app.auth.templates'])

.factory '$ref' ($http, $rootScope)->
    result = 
        base: new Firebase('https://torid-fire-3655.firebaseio.com')
    $http.get('/generate').success (data)->
        (error) <- result.base.auth(data.token)
        console.log("Login Failed!", error) if error
        result.netid = data.netid
        $rootScope.$broadcast('loggedin')
    return result

.config ($routeProvider)->
    $routeProvider.
        when('/', {controller:'MainCtrl', templateUrl:'app/auth/main.jade'})

.controller 'MainCtrl', ($firebase, $scope, $ref, $modal)->
    $scope.messages = $firebase($ref.base.child('messages'))

    $scope.$on 'loggedin', ->
        $firebase($ref.base.child("users/#{$ref.netid}")).$bind($scope, "me").then (unbind)->
            if not $scope.me.name?
                $modal.open(
                    templateUrl: 'askId'
                    controller: ($scope, $modalInstance)->
                        $scope.info = {}
                        $scope.dismiss = ->
                            $modalInstance.close($scope.info)
                ).result.then (val)->
                    $scope.me = val

    $scope.submit = ->
        $scope.messages.$add({netid: $ref.netid, body: $scope.message})
        $scope.message = ''