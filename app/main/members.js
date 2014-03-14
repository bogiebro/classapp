angular.module("app.members", ['app.auth'])

.controller('MembersCtrl', function ($scope, $group) {
    $scope.group = $group.props;
    $scope.group.name = "AwesomeGroup17"
    $scope.form = {}
    $scope.testing  = "Isaac";
    $scope.membersList = [{name:"Jane Doe"},{name:"Yejin Xu"},{name:"Preeti Patel"}];

    $scope.inviteMember = function(){

        $scope.membersList.push({name:$scope.form.memberNameInput});
        $scope.testing = "pushed event";
        $scope.testing = $scope.messageInput;
	$scope.form.memberNameInput = "";
    }

    $scope.inviteGroupMembers = function(){

        $scope.membersList.push({name:"blah"},{name:"de"},{name:"blah"},{name:"blah..."});
        $scope.testing = "pushed event";
        $scope.testing = $scope.messageInput;
	$scope.form.groupInput = "";
    }

})
