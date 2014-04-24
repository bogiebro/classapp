angular.module("app.events", ['app.auth'])


.controller('EventsCtrl', function ($scope, $firebase, $group, $ref, $users, $timeout) {
   
//     $scope.eventList= $ref.base.child('groups/' + $group.props.id + '/events');
//           console.log("new ref is " + $scope.eventList)
//           var eventref= $ref.base.child('groups/' + $group.props.id + '/events');
//            $scope.eventRef = $firebase(eventref);
//     console.log("eventctl1")
//     
//     $scope.form = {}
//     $scope.dayobject = {}
//     $scope.today= new Date()
//     $scope.editing = false;
//     $scope.editID = "";
//     
//
//     $scope.testing = "Space reserved for test messages";
//
//          $scope.testing = $scope.group.id;
//
//     $scope.isCollapsed = true;
//     $scope.display = {}
//     $scope.createButton = "Create an Event"
//
//
//     $group.props.watch("classCode", function(id, oldval, newval){
//    //     
//          $scope.isCollapsed = true;
//          $scope.eventList= $ref.base.child('groups/' + $group.props.id + '/events');
//         //  console.log("new ref is " + $scope.eventList)
//           var eventref= $ref.base.child('groups/' + $group.props.id + '/events');
//            $scope.eventRef = $firebase(eventref);
//      //       console.log("check")
// //
//        
//     });
//
//
//
//     $scope.expandCreator = function(){
//         $scope.isCollapsed = !$scope.isCollapsed;
//         if( $scope.isCollapsed) {
//             $scope.createButton = "Create an Event";
//         }else{
//             $scope.createButton = "close event creator";
//         }
//     }
//
//      $scope.newEvent = function(){
//         var eventMessage = "TBA";
//         var eventLocation = "TBA";
//         //var eventTime = 11;
//         if ($scope.form.messageInput ) eventMessage = $scope.form.messageInput;
//         if ($scope.form.locationInput ) eventLocation = $scope.form.locationInput;
//         if (parseInt($scope.form.messageInput)) eventMessage = $scope.form.messageInput;
//       //   console.log(eventTime)
//         //  console.log($scope.form.AM)
//         //if (! $scope.form.AM) eventTime = eventTime +12;
//         $scope.testing = "called";
//       //  console.log(eventTime)
//        // $ref.base.child("groups/" + $group.props.id ).once 'value' (snap)
//        //$scope.dayobject.dt.setHours(eventTime);
//        var mem = {};
//        var name = $ref.netid;
//        mem[name] = $ref.netid;
//         var newevent = {"date":$scope.dayobject.dt.toUTCString(),
//                 "message":eventMessage, "location":eventLocation, Members:mem};
//
//      // $ref.base.child('groups/' + $group.props.id).push(newevent);
//
//           $scope.eventList.push().setWithPriority(newevent,
//                                  $scope.dayobject.dt.getTime());
//
//       
//          console.log("pushed event")
//          $scope.form.locationInput = "";
//          $scope.form.messageInput = "";
//      }
//     
//     
//
//      $scope.toDate = function(dateString){
//         var newdate = new Date(dateString);
//         
//         return newdate;
//      }
//
//     
//      $scope.eventList.endAt($scope.today.getTime()).on('child_added', function(snapshot) {
//         var EventInfo = snapshot.val();
//         var eventName = snapshot.name();
//       // $scope.eventList.child(eventName).remove();
//         EventInfo.remove();
//     });
//
//
//      $scope.edit = function( eventId){
//        // $scope.edtingID = eventID;
//        // $scope.editing = true;
//        //$scope.editRef = 
//         console.log(eventId)
//      }
//
//
//
//     
//     $scope.today = function() {
//         //sets the date to the current date
//         $scope.dayobject.dt = new Date();
//     };
//     $scope.today();
//
//     $scope.showWeeks = true;
//     $scope.toggleWeeks = function () {
//      $scope.showWeeks = ! $scope.showWeeks;
//     };
//
//     $scope.clear = function () {
//      $scope.dt = null;
//     };
//
//     // Disable weekend selection
//     $scope.disabled = function(date, mode) {
//      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//     };
//
//     $scope.toggleMin = function() {
//      $scope.minDate = ( $scope.minDate ) ? null : new Date();
//     };
//     $scope.toggleMin();
//
//     $scope.open = function($event) {
//         $event.preventDefault();
//         $event.stopPropagation();
//
//      $scope.opened = true;
//     };
//
//     $scope.dateOptions = {
//         'year-format': "'yy'",
//         'starting-day': 1
//     };
//
//     $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
//     $scope.format = $scope.formats[0];
//    
//
//    $scope.convertTime = function (date) {
//        var dt = new Date(date);
//        return dt.getTime();
//    }
//
//
//

})
