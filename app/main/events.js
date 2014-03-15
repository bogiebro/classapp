angular.module("app.events", ['app.auth'])

.controller('EventsCtrl', function ($scope, $firebase, $group, $ref) {
        
      //var myApp = angular.module("MyApp", ["firebase"]);
    $scope.group = $group.props;
    $scope.form = {}
    $scope.dayobject = {}
    
   
    
    $scope.testing  = "Space reserved for test messages";
    var eventref = new Firebase('https://myfirstbase.firebaseio.com/');
    $scope.eventList = $firebase(eventref);
    

     $scope.newEvent = function(){
        $scope.form.messageInput = "TBA";
        $scope.form.locationInput = "TBA";
       
        if ( $scope.form.messageInput !=="" ) {eventMessage = $scope.form.messageInput;}
        if ( $scope.form.locationInput !== "")  eventLocation = $scope.form.locationInput;
        var index =0;


        $scope.eventList.$add({date:$scope.dayobject.dt.toUTCString(), message:$scope.form.messageInput,
                                   location:$scope.form.locationInput, members:""}).setPriority($scope.dayobject.dt.getTime());
        
        //$scope.eventList.push().setWithPriority({date:$scope.dayobject.dt.toUTCString(), message:$scope.form.messageInput,
          //                         location:$scope.form.locationInput, members:""}, $scope.dayobject.dt.getTime());
        
        $scope.testing = $scope.dayobject.dt.getTime();
         $scope.form.locationInput = "";
         $scope.form.messageInput = "";
     }

     
    $scope.archiveEvents = function(){
        // remove passed events
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



})
