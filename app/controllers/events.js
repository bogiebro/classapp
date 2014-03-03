angular.module("app.events", ['app.auth'])

.controller('EventsCtrl', function ($scope, $group) {
    $scope.group = $group.props;
    $scope.testing  = "James";
    $scope.eventsList = [{date:"3/2/2014", message:"Presentation prep", location:"Swing Space"},
         {date:"3/3/2014", message:"Presentation", location:"DL220"}];
     
     $scope.newEvent = function(){

        $scope.eventsList.push({date:$scope.dateInput, message:$scope.messageInput,
                                   location:$scope.locationInput });
        $scope.testing = "pushed event";
        $scope.testing = $scope.messageInput;
     }
})
