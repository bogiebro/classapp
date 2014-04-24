angular.module("app.auth", ['firebase', 'ngCookies'])

# gives you access to the authenticated firebase object ($ref.base)
# at starting node (aka 'classcodes', 'classname', 'groups' are children)
# and the user's netid ($ref.netid) as string
.factory '$ref' ($cookies, $rootScope, $firebase, $window)->
    refScope = {}
    cookieData = JSON.parse($cookies.casInfo)
    netid = cookieData.netid
    firebase = new Firebase($PROCESS_ENV_FIREBASE)
    do
      error <- firebase.auth(cookieData.token)
      if error
        if error.code is "EXPIRED_TOKEN"
            $window.location.assign("/refresh?url=#{encodeURIComponent $window.location}")
        else console.log('Cookie data corrupted', error)
      else
        $rootScope.$broadcast('loggedin')
        firebase.child("users/#{netid}/props/name").once 'value' (snap)!->
          $rootScope.$broadcast('newuser') if not snap.val!
    refScope.base = firebase
    refScope.netid = netid
    return refScope

# returns a function that takes a firebase ref
# and stores at that ref a map from netids to person objects
.factory '$trackConnected' ($ref)->
    (connections)!-> 
      conRef = $ref.base.root!child '.info/connected'
      childRef = connections.child($ref.netid)
      namesnap <- $ref.base.child("users/#{$ref.netid}/props").once 'value'
      snap <- conRef.on 'value'
      if (snap.val!)
        childRef.set namesnap.val!
        childRef.onDisconnect!remove!

# $users.users is a map from netid to user info
# $users.groups is a map from group id to a map of netid to netid
# see members.js for an example of use
.factory '$users' ($ref, $rootScope, $timeout)->
  result = {}
  result.groups = $rootScope.$new!
  result.users = $rootScope.$new!
  $ref.base.child("users/#{$ref.netid}/groups").on 'child_added' (gsnap)!->
    val = gsnap.val!
    result.groups[val] = {}
    $timeout((->$ref.base.child("groups/#{val}/users").on 'child_added' (user)!->
        netid = user.val!
        result.groups.$apply(!->
          result.groups[val][netid] = netid)
        if (!result.users[netid])
          result.users[netid] = {}
          $ref.base.child("users/#{netid}/props").once 'value' (snap)!->
            result.users.$apply(!->
              result.users[netid] <<< snap.val!
              result.users[netid].netid = netid)
          $ref.base.child("ratings/" + ratingRef([$ref.netid, netid])).once 'value' (snap)!->
            result.users.$apply(!-> result.users[netid] <<< snap.val!))
      , 0)
  return result

# $group.props gives the currently selected group's properties (name, id, etc)
# $group.setGroup takes a group id to set as currently selected
# call $group.clearGroup when back on the group page
.factory '$group' ($ref, $timeout, $rootScope, $location)->
    result = {}
    result.props = $rootScope.$new!
    result.setGroup = (groupid, callback)!->
        result.props.id = groupid
        $ref.base.child("groups/#{groupid}/props").on 'value' (snapshot)->
          $timeout((->
            result.props.$apply(->
              result.props <<< snapshot.val!
              result.props.id = groupid
              callback() if callback
              ))
            , 0)
    result.clearGroup = !->
      result.props.name = ''
      result.props.id = ''
      $location.path('/bigevents')
    return result

# create the identifier for compatibility between people
ratingRef = (l)-> l.sort!join('')
