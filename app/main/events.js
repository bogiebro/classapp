angular.module("app.events", ['app.auth'])


.controller('EventsCtrl', function ($scope, $firebase, $group, $ref) {
        
      //var myApp = angular.module("MyApp", ["firebase"]);
    $scope.group = $group.props;
    $scope.form = {}
    $scope.dayobject = {}
    $scope.today= new Date()
   

    $scope.testing  = "Space reserved for test messages";
    //currently useing external firebase will migrate soon
    var eventref = new Firebase('https://myfirstbase.firebaseio.com/');
    $scope.eventRef = $firebase(eventref);// angle fire refrence used for reading to array
    //firebase refrence used to write new data
    $scope.eventList = new Firebase('https://myfirstbase.firebaseio.com/');

    $scope.isCollapsed = true;
    $scope.display = {}
    $scope.createButton = "Create an Event"
    $scope.expandCreator = function(){
        $scope.isCollapsed = !$scope.isCollapsed;
        if( $scope.isCollapsed) {
            $scope.createButton = "Create an Event";
        }else{
            $scope.createButton = "close event creator";
        }
    }

     $scope.newEvent = function(){
        var eventMessage = "TBA";
        var eventLocation = "TBA";
        
        if ($scope.form.messageInput ) eventMessage = $scope.form.messageInput;
        if ($scope.form.locationInput )  eventLocation = $scope.form.locationInput;
        $scope.testing = "called";
        
        //.setPriority($scope.dayobject.dt.getTime());
         $scope.eventList.push().setWithPriority({"date":$scope.dayobject.dt.toUTCString(), "message":eventMessage, 
                                "location":eventLocation, Members:{}}, $scope.dayobject.dt.getTime());
         $scope.testing = "pushed"
         $scope.form.locationInput = "";
         $scope.form.messageInput = "";
     }
    

     $scope.dsiplayParser = function(){
        var newdate = new Date(); 
        var curdate = new Date();
        var display = {};
        display.text = "";
        if ( newdate.getDay() == curdate.getDay()) display.text = display.text + "Today";
        else  display.text = display.text + newdate.getDay();
        if ( newdate.getDate() - curdate.getDate() >= 7) display.text = display.text + " " + newdate.getDate();
        display.text= "hello"
        $scope.display.text= display.text;
        return display.text;
     }
    
    // $scope.eventList.endAt($scope.today.getTime).on('child_added', function(snapshot) {
      //  var EventInfo = snapshot.val();
       // alert('date ' + EventInfo.date + ' Message: ' + EventInfo.message);
    //});



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


    
    $scope.today = function() {
        //sets the date to the current date
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
   

   $scope.convertTime = function (date) {
       var dt = new Date(date);
       return dt.getTime();
   }


})
