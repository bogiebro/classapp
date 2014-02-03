app = angular.module("tester", ["firebase"])
app.controller 'TestCtrl', ($scope, $firebase, $http)->

    var netid

    dataRef = new Firebase('https://torid-fire-3655.firebaseio.com')
    do
        data <- $http.get('/generate').success
        netid := data.netid
        error <- dataRef.auth(data.token)
        if (error) then console.log("Login Failed!", error)
        else console.log("Login Succeeded!")

    $scope.messages = $firebase(dataRef);

    $scope.submit = ->
        $scope.messages.$add({netid: netid, body: $scope.message});
        $scope.message = '';