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
  textbar design
    minimal buttons

*/
angular.module("app.chat", ['app.auth', 'ui.bootstrap.collapse'])

.controller('ChatCtrl', function ($scope, $timeout, $ref, $group, $users, $location, $anchorScroll) { 
  var userinfo = $users.users[$ref.netid]; // capture logged in user's info: name, netid
  $scope.groupChats = {}; // holds all chats for a group
  $scope.arrChats = [];
  $scope.mapChatIDs = {};
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
            arrayify();
            console.log($scope.arrChats);
          }, 0);
        }); 
      });
    }
  });

  arrayify = function () {
    var i = 0;
    for (key in $scope.groupChats) {
      $scope.arrChats.push($scope.groupChats[key]);
      $scope.mapChatIDs[key] = i;
      i++;
    }
  }

  // returns CHATS that match
  $scope.search = function (text, index) {
    // console.log(index);
    // if (index == $scope.props.index) return true; 
    return function (chat) {
      if ($scope.props.selChatID != "") {
        console.log("chatid: " + $scope.props.selChatID);
        return true;
      }
      if (text == undefined || text == '') return true;
      for (key in chat) { // iterate through message keys
        for (metadata in chat[key]) {
          if (typeof chat[key][metadata] != 'string') continue;
          if (chat[key][metadata].match(new RegExp('.*' + text + '.*')) != null) return true;
        }
      }
      return false;
    }
  }

  $scope.props = {selChatID: "", index: -1, error: false};

  // Input: Num, $index of chats ngrepeat; Str, chatid
  // Toggles focus, highlight of chat elmt for reply, style 
  $scope.select = function (index) {
    if ($scope.props.index == index) {
      $scope.resetProps();
    } else {
      $scope.props.index = index;
      $scope.props.selChatID = findChatID(index);
    }
  }

  $scope.resetProps = function () {
    console.log('reset');
    $scope.props.index = -1;
    $scope.props.selChatID = "";
    // $scope.props.error = false;
  }

  var findChatID = function (index) {
    for (key in $scope.mapChatIDs) {
      if ($scope.mapChatIDs[key] == index) return key;
    }
  }

  // Input: Obj, firebase chatRef;
  // side input: Str, $scope.textBox; userinfo props
  // Creates new child in chat, adds message  
  $scope.newMessage = function (chatRef) {
    if ($scope.textBox == undefined || $scope.textBox.trim() == "") {
      $scope.props.error = true;
      console.log("Submit pressed");
    } else {
      var newMsg = chatRef.push({
        'content': $scope.textBox || "Test Message", 
        'date': new Date().getTime(), 
        'name': userinfo.name, 
        'netid': userinfo.netid
      });
      $scope.resetProps();
      $scope.props.error = false;
      $scope.textBox = "";
      $scope.textForm.$setPristine();
      chatRef.on('value', function (chatsSnapshot) {
          $timeout(function () {
            $scope.$apply(function () {
              $scope.arrChats[$scope.mapChatIDs[chatRef.name()]] = chatsSnapshot.val();
              // $scope.groupChats = chatsSnapshot.val();
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
    if ($scope.textBox == undefined || $scope.textBox.trim() == "") {
      $scope.props.error = true;
      console.log("Submit pressed");
    } else {
      var newchat = chatsRef.push();  // new chatid
      var chatid = newchat.name();
      $scope.arrChats.push({});
      $scope.mapChatIDs[chatid] = $scope.arrChats.length - 1;
      $scope.newMessage($scope.makeChatRef(chatid));
    }
  }

  // input: Str, chatid fetched from $scope.props.
  // output: Obj, firebase ref to chatid
  $scope.makeChatRef = function (chatid) { // CHECK FOR BAD CHATIDS HERE; REPLY ERRORS
    return $ref.base.child('groups/'+ $group.props.id + '/quipu/' + chatid); 
  }
})
