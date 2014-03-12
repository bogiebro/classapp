angular.module("app.events", ['app.auth'])
//to do 

//tie to firebase
//pop out event edit/ creation
//member addtion/ removal button and access control 
//ref.me use refrence delay possible
//ref.group ish
.controller('EventsCtrl', function ($scope, $firebase, $group, $ref) {
        
      //var myApp = angular.module("MyApp", ["firebase"]);
    $scope.group = $group.props;
    $scope.form = {}
    $scope.dayobject = {}
    $scope.dp={}
    $scope.dp.Date = new Date(2014, 4, 3, 4);
   
    $scope.eventsList={}
    $scope.testing  = "James";
    var eventref = new Firebase('https://myfirstbase.firebaseio.com/');
    $scope.eventFire = $firebase(eventref);

    //$scope.eventsList.push({message:"Presentation", date:$scope.dp.Date.toUTCString(),  location:"DL 220", members:""});

     $scope.newEvent = function(){
        $scope.eventMessage = "TBA";
        $scope.eventLocation = "TBA";
       
        if ( $scope.form.messageInput !=="" ) {eventMessage = $scope.form.messageInput;}
        if ( $scope.form.locationInput !== "")  eventLocation = $scope.form.locationInput;
        var index =0;
       
        //for ( var E in $scope.eventsList ){
           // $scope.testing = $scope.eventsList[E].date;
          //   if ($scope.dayobject.dt < $scope.eventsList[index].date) {
           //     break;
           //  } 
        //     index = index +1;
        //}
        //$scope.testing = index;
        //$scope.eventsList.splice(index, 0, {date:$scope.dayobject.dt, message:$scope.eventMessage,
          //                         location:$scope.eventLocation, members:"" });
        $scope.eventFire.$add({date:$scope.dayobject.dt.toUTCString(), message:$scope.form.messageInput,
                                   location:$scope.form.locationInput, members:""});

        //$scope.testing = index;
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
   



})
