angular.module("app.events", ['app.auth'])


.controller('EventsCtrl', function ($scope, $firebase, $group, $ref) {
        
      //var myApp = angular.module("MyApp", ["firebase"]);
    $scope.group = $group.props;
    $scope.form = {}
    $scope.dayobject = {}
    $scope.isCollapsed = true;
    $scope.display = {}
    
    $scope.testing  = "Space reserved for test messages";
    var eventref = new Firebase('https://myfirstbase.firebaseio.com/');
    $scope.eventRef = $firebase(eventref);

    $scope.eventList = new Firebase('https://myfirstbase.firebaseio.com/');

   

     $scope.newEvent = function(){
        var eventMessage = "TBA";
        var eventLocation = "TBA";
        
        if ($scope.form.messageInput ) eventMessage = $scope.form.messageInput;
        if ($scope.form.locationInput )  eventLocation = $scope.form.locationInput;
        $scope.testing = "called";

        //$scope.eventRef.$add({date:$scope.dayobject.dt.toUTCString(), message:$scope.form.messageInput,
         //                          location:$scope.form.locationInput,
           //                         time:$scope.dayobject.dt.getTime(), members:""}).then(function(ref)
             //                      {
               //                     ref.$priority=$scope.dayobject.dt.getTime();
                 //                   ref.$save();
                   //                });
        
        //.setPriority($scope.dayobject.dt.getTime());
         $scope.eventList.push().setWithPriority({"date":$scope.dayobject.dt.toUTCString(), "message":eventMessage, 
                                "location":eventLocation, Members:{}}, $scope.dayobject.dt.getTime());
        //$scope.eventList.push({ message:testing})
        //date:$scope.dayobject.dt.toUTCString(), message:eventMessage,
                                   //location:eventLocation, members:""
        //.setPriority($scope.dayobject.dt.getTime());
        console.log('Hello');
        $scope.testing = "pushed"
        //$scope.eventList.push().setWithPriority({date:$scope.dayobject.dt.toUTCString(), message:$scope.form.messageInput,
        //                           location:$scope.form.locationInput, members:""}, $scope.dayobject.dt.getTime());
        //$scope.eventList.$save();
        //$scope.testing = $scope.form.messageInput;
         $scope.form.locationInput = "";
         $scope.form.messageInput = "";
     }
     $scope.dsiplayParser = function(dateString){
        var newdate = new Date(dateSting); 
        var curdate = new Date();
        var display = {};
        display.text = "";
        if ( newdate.getDay() === curdate.getDay()) display.text = display.text + "Today";
        else  display = display + newdate.getDay();
        if ( newdate.getDate() - curdate.getDate() >= 7) display.text = display.text + " " + newdate.getDate();
        display.text= "hello"
        $scope.display.text= display.text;
        return ""
     }
     
    $scope.archiveEvents = function(){
        // remove passed events
        angular.forEach($scope.eventList, function(event) {
            $scope.event.$child(event.$id).$set({displaydate: "hello"});
        });
    }


    $scope.addmember = function(){
        //add members to an event
        //need to find out how to acess 
    }

    $scope.removeMember = function(){
        //remove a member from an event
    }



    $scope.displaydate = function(){
        $scope.testing = $scope.dayobject.dt;
        //$scope.dt = new Date(79,5,24);
    }

    
    $scope.today = function() {
        //$scope.testing = $scope.dt;
        $scope.dayobject.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
     $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
     $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
     $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

     $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
   //$scope.testing = $scope.dayobject.dt.getTime();

   $scope.convertTime = function (date) {
       var dt = new Date(date);
       return dt.getTime();
   }


})
