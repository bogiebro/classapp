/*
Implement:
  search
  click to toggle reply/unreply
  delete messages
  tags/hashtags

Edge cases to deal with:
  Replying to an unselected chat, no selChatID = ''

Style:
  message design
  chat design
    accordian
  textbar design
    fixed at bottom
    minimal buttons

*/
angular.module("app.chat", ['app.auth'])

.controller('ChatCtrl', function ($scope, $timeout, $ref, $group, $users, $location, $anchorScroll) { 
  var userinfo = $users.users[$ref.netid]; // capture logged in user's info: name, netid
  $scope.groupChats = {}; // holds all chats for a group
  var chatsRef = {}; // firebase ref to selected group's chats
  
  // ADD COMMENT DOC
  $scope.$watch('group.id', function (newvalue, oldvalue) {
    if (!newvalue) {
      $location.path('/bigevents');
      console.log("group unselected");
    } else {
      chatsRef = $ref.base.child('groups/'+ $group.props.id + '/quipu');      
      chatsRef.once('value', function (chatsSnapshot) {
        $timeout(function () {
          $scope.$apply(function () {
            $scope.groupChats = chatsSnapshot.val();
          }, 0);
        }); 
      });
    }
  });

  // $scope.toggled = true;          // checks whether search is toggled
  // $scope.textBox = "";
  $scope.props = {selChatID: "", index: -1, error: false};
  // $scope.props.selChatID = ""; // holds the reference to the chat in focus
  // $scope.props.index = -1;

  $scope.toggle = function () {
      $scope.toggled = !scope.toggled;
  }

  // Util function to filter comments by textbox contents when search toggled 
  $scope.commentSearch = function () {
      if ($scope.toggled) {
          return $scope.textBox;
      } else {
          return "";
      }
  }

  // Displays proper placeholder for textbox, when searching or writing
  $scope.toggleSearch = function () {
      if ($scope.props.index != -1) {
          // untoggle search
          return "search here"
      } else {
          return "add comment here"
      }
  };

  // Input: Num, $index of chats ngrepeat; Str, chatid
  // Toggles focus, highlight of chat elmt for reply, style 
  $scope.select = function (index, chatid) {
    if ($scope.props.index == index) {
      resetProps();
    } else {
      $scope.props.index = index;
      $scope.props.selChatID = chatid;
    }
  }

  var resetProps = function () {
    $scope.props.index = -1;
    $scope.props.selChatID = "";
    // $scope.props.error = false;
  }

  // Input: Obj, firebase chatRef;
  // side input: Str, $scope.textBox; userinfo props
  // Creates new child in chat, adds message  
  $scope.newMessage = function (chatRef) {
    if ($scope.textBox == undefined || $scope.textBox.trim() == "") {
      $scope.props.error = true;
      console.log("Submit pressed");
    } else {
      chatRef.push({
        'content': $scope.textBox || "Test Message", 
        'date': new Date().getTime(), 
        'name': userinfo.name, 
        'netid': userinfo.netid
      });
      resetProps();
      $scope.props.error = false;
      $scope.textBox = "";
      $scope.textForm.$setPristine();
      chatsRef.on('value', function (chatsSnapshot) { // abstract to separate function?
          $timeout(function () {
            $scope.$apply(function () {
              $scope.groupChats = chatsSnapshot.val();
            }, 0);
          }); 
      });
    }
  }

  // Input: Num, epoch seconds
  // Output: Str, representation of date
  $scope.renderDate = function(epochsecs) {
    return moment(new Date(epochsecs)).format("h:mma, ddd MMM Do, YYYY");
  }

  // Creates new chat chain in firebase, calls $scope.newMessage() to add message
  $scope.newChat = function () {
    var newchat = chatsRef.push();
    var chatid = newchat.name();
    $scope.newMessage($scope.makeChatRef(chatid));
  }

  // input: Str, chatid fetched from $scope.props.
  // output: Obj, firebase ref to chatid
  $scope.makeChatRef = function (chatid) { // CHECK FOR BAD CHATIDS HERE; REPLY ERRORS
    return $ref.base.child('groups/'+ $group.props.id + '/quipu/' + chatid); 
  }
})
