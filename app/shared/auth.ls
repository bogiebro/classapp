angular.module("app.auth", ['firebase', 'ngCookies'])

# gives you access to an authenticated firebase url ($ref.base)
# the user's netid ($ref.netid) and the user's info ($ref.me)
.factory '$ref' ($cookies, $rootScope, $firebase, $window)->
    refScope = $rootScope.$new()
    cookieData = JSON.parse($cookies.casInfo)
    netid = cookieData.netid
    firebase = new Firebase($PROCESS_ENV_FIREBASE)
    do
        error <- firebase.auth(cookieData.token)
        if error
            console.log('got an error')
            if error.code is "EXPIRED_TOKEN"
                $window.location.assign("/refresh?url=#{encodeURIComponent $window.location}")
            else console.log('Cookie data corrupted', error)
        else
            firebase.child("users/#{netid}").update({exists: true})
            $firebase(firebase.child("users/#{netid}")).$bind(refScope, "me").then (unbind)->
                $rootScope.$broadcast('newuser') if not refScope.me.name?
                $rootScope.$broadcast('loggedin')
    refScope.base = firebase
    refScope.netid = netid
    refScope.loggedin = false
    return refScope

# returns a function that takes a firebase ref
# and stores at that ref a map from netids to person objects
.factory '$trackConnected' ($ref)->
    (connections)!-> 
      conRef = $ref.base.root!child '.info/connected'
      childRef = connections.child($ref.netid)
      conRef.on 'value' (snap)!->
        if (snap.val!)
          childRef.set {name: $ref.me?.name or $ref.netid}
          childRef.onDisconnect!remove!

# $users.list will give the users for the current group
# this is not always the same reference: you'll need the following
#
# $users.props.$watch 'list' (val, oldval)-> $scope.users = val
#
# TODO: should pull it once, then pull just the updates
.factory '$users' ($group, $ref, $rootScope, $timeout)->
  result = {}
  result.props = $rootScope.$new()
  $group.props.$watch 'id' (val, oldval)->
    result.props[val] = {} if !result[val]
    result.props.list = result.props[val]
    $timeout( (!->
      $ref.base.child("group/#{val}/users").once 'value' (users)!->
          for key, netid of users.val!
            result.props[val][netid] = {}
            $ref.base.child("users/#{netid}").once 'value' (snap)!->
              result.props.$apply(-> result.props[val][netid] <<< snap.val!)
            $ref.base.child("ratings/" + ratingRef([$ref.netid, netid])).once 'value' (snap)!->
              result.props.$apply(-> result.props[val][netid] <<< snap.val!))
      , 0)
  return result

# $group.name gives the currently selected group name
# $group.setGroup takes a group id to set as currently selected
# call $group.clearGroup when back on the group page
.factory '$group' ($ref, $rootScope, $timeout)->
    result = {}
    result.props = $rootScope.$new()
    result.setGroup = (groupid)!->
        result.props.id = groupid
        $timeout( (!->
            $ref.base.child("group/#{groupid}/name").on 'value' (snapshot)->
                result.props.$apply(->result.props.name = snapshot.val!)), 0)
    result.clearGroup = !-> result.props.name = ''
    return result

# create the identifier for compatibility between people
ratingRef = (l)-> l.sort!join('')
