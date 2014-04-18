angular.module("app.events", ['app.auth'])


.controller('EventsCtrl', function ($scope, $firebase, $group, $ref, $users, $timeout) {
     
 //      //var myApp = angular.module("MyApp", ["firebase"]);
 //    //$scope.mainGroup= $group;
 //    $scope.eventList= $ref.base.child('groups/' + $group.props.id + '/events');
 //          console.log("new ref is " + $scope.eventList)
 //          var eventref= $ref.base.child('groups/' +  $group.props.id + '/events');
 //           $scope.eventRef = $firebase(eventref);
 //    console.log("eventctl1")
 //    


 //          

 //    $scope.form = {}
 //    $scope.dayobject = {}
 //    $scope.today= new Date()
 //   

 //    $scope.testing  = "Space reserved for test messages";
 //    //currently useing external firebase will migrate soon
 //    //var eventref = new Firebase('https://myfirstbase.firebaseio.com/');
 //   // $scope.eventRef = $firebase(eventref);// angle fire refrence used for reading to array
 //    //firebase refrence used to write new data
 //    //$scope.eventList = new Firebase('https://myfirstbase.firebaseio.com/');
 //         $scope.testing = $scope.group.id;    

 //    $scope.isCollapsed = true;
 //    $scope.display = {}
 //    $scope.createButton = "Create an Event"


 // $group.props.watch("id", function(id, oldval, newval){
 //        
 //         $scope.isCollapsed = true;
 //          $scope.eventList= $ref.base.child('groups/' + newval + '/events');
 //          console.log("new ref is " + $scope.eventList)
 //          var eventref= $ref.base.child('groups/' + newval + '/events');
 //           $scope.eventRef = $firebase(eventref);
 //            console.log($scope.eventRef)

 //       
 //     });



 //    $scope.expandCreator = function(){
 //        $scope.isCollapsed = !$scope.isCollapsed;
 //        if( $scope.isCollapsed) {
 //            $scope.createButton = "Create an Event";
 //        }else{
 //            $scope.createButton = "close event creator";
 //        }
 //    } 

 //     $scope.newEvent = function(){
 //        var eventMessage = "TBA";
 //        var eventLocation = "TBA";
 //        if ($scope.form.messageInput ) eventMessage = $scope.form.messageInput;
 //        if ($scope.form.locationInput )  eventLocation = $scope.form.locationInput;
 //        $scope.testing = "called";
 //       // $ref.base.child("groups/" + $group.props.id ).once 'value' (snap)
 //       var mem = {};
 //       var name = $ref.netid;
 //       mem[name] = $ref.netid;
 //        var newevent = {"date":$scope.dayobject.dt.toUTCString(), 
 //                "message":eventMessage, "location":eventLocation, Members:mem};

 //     //  $ref.base.child('groups/' + $group.props.id).push(newevent);

 //          $scope.eventList.push().setWithPriority(newevent,
 //                                 $scope.dayobject.dt.getTime());

 //        if ($ref.base.child('groups/' + $group.props.id).events == undefined){
 //            console.log("its empty")
 //            console.log($group.props)
 //            $ref.base.child('groups/' + $group.props.id).child("events").set("test val");
 //            //$ref.base.child('groups/' + $group.props.id).push({events:"test val"});
 //            //({"events": { newevent} })
 //        }
 //        else{
 //            console.log("pushing to events set");
 //        
 //         $scope.eventList.push().setWithPriority(newevent,
 //                                 $scope.dayobject.dt.getTime());
 //        }
 //         console.log("pushed event")
 //         $scope.form.locationInput = "";
 //         $scope.form.messageInput = "";
 //     }
 //    
 //    

 //     $scope.toDate = function(dateString){
 //        var newdate = new Date(dateString); 
 //        
 //        return newdate;
 //     }
 //    
 //     $scope.eventList.endAt($scope.today.getTime()).on('child_added', function(snapshot) {
 //        var EventInfo = snapshot.val();
 //        var eventName = snapshot.name();
 //      //  $scope.eventList.child(eventName).remove(); 
 //        EventInfo.remove();
 //    });



 //   

 //    $scope.addMember = function(eventName){
 //        var addRef = $scope.eventList.child(eventName);
 //        console.log(addRef);
 //        
 //        
 //    }

 //    $scope.removeMember = function(){
 //        //remove a member from an event
 //    }


 //    
 //    $scope.today = function() {
 //        //sets the date to the current date
 //        $scope.dayobject.dt = new Date();
 //    };
 //    $scope.today();

 //    $scope.showWeeks = true;
 //    $scope.toggleWeeks = function () {
 //     $scope.showWeeks = ! $scope.showWeeks;
 //    };

 //    $scope.clear = function () {
 //     $scope.dt = null;
 //    };

 //    // Disable weekend selection
 //    $scope.disabled = function(date, mode) {
 //     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
 //    };

 //    $scope.toggleMin = function() {
 //     $scope.minDate = ( $scope.minDate ) ? null : new Date();
 //    };
 //    $scope.toggleMin();

 //    $scope.open = function($event) {
 //        $event.preventDefault();
 //        $event.stopPropagation();

 //     $scope.opened = true;
 //    };

 //    $scope.dateOptions = {
 //        'year-format': "'yy'",
 //        'starting-day': 1
 //    };

 //    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
 //    $scope.format = $scope.formats[0];
 //   

 //   $scope.convertTime = function (date) {
 //       var dt = new Date(date);
 //       return dt.getTime();
 //   }


})
