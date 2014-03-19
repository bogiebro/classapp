angular.module("app.chat", ['app.auth'])

.controller('ChatCtrl', function ($scope) {
    $scope.toggled = true;          // checks whether search is toggled
    $scope.textBox = "";
    $scope.focus = {};              // holds the reference to the chain in focus
    $scope.chains = [               // holds all chains, as head and tail structure
        {
            head : {content: "How does angular work?", user: "Marco", date: "Should be a date"},
            tail : [
                {content: "You're an idiot", user: "Polo", date: "string for now"},
                {content: "Hello", user: "Peter", date: "asdas"}
            ]
        },
        { 
            head: {content: "angular works?", user: "Pablo", date: "June 1, 2014"},
            tail : [
            {content: "You're still stupid", user: "Bob", date: "still string"},
            {content: "Hi!", user: "Emily", date: "love"}
            ]
        }
    ];

    // Util function to filter comments by textbox contents when search toggled 
    $scope.commentSearch = function () {
        if ($scope.toggled) {
            return $scope.textBox;
        } else {
            return "";
        }
    }

    // Displays proper placeholder for textbox, when searching or writing
    $scope.placeholder = function () {
        if ($scope.toggled === true) {
            return "search here"
        } else {
            return "add comment here"
        }
    };

    // Adds comment to an existing focused chain, to end of tail
    $scope.addComment = function () {
        if(!$scope.toggled && $scope.textBox.trim() != "") {
            $scope.focus.chain.tail.push({content: $scope.textBox, user: "John", date: "May 2, 2014"});
            $scope.textBox = "";
            $scope.error = "";
        } else {
            $scope.error = "ERROR"; 
        }
    }

    // Adds a comment as the head of a new chain
    $scope.newComment = function () {
        if(!$scope.toggled && $scope.textBox.trim() != "") {
            $scope.chains.push({
                head: {content: $scope.textBox, user: "Noah", date: "June 2, 2014"},
                tail : []
            });
            $scope.textBox = "";
            $scope.error = "";  
        } else {
            $scope.error = "ERROR"; 
        }
    }
})