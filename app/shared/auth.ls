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
# $users.groups is a map from group id to a list of netids
# see members.js for an example of use
.factory '$users' ($ref, $rootScope, $timeout)->
  result = {}
  result.groups = $rootScope.$new!
  result.users = $rootScope.$new!
  $ref.base.child("users/#{$ref.netid}/groups").on 'child_added' (gsnap)!->
    val = gsnap.val!.id
    result.groups[val] = []
    $timeout((->$ref.base.child("groups/#{val}/users").on 'child_added' (user)!->
        netid = user.val!.netid
        result.groups.$apply(result.groups[val].push(netid))
        if (!result.users[netid])
          result.users[netid] = {}
          $ref.base.child("users/#{netid}").on 'value' (snap)!->
            result.users.$apply(result.users[netid] <<< snap.val!)
          $ref.base.child("ratings/" + ratingRef([$ref.netid, netid])).once 'value' (snap)!->
            result.users.$apply(result.users[netid] <<< snap.val!))
      , 0)
  return result

# $group.props.name gives the currently selected group name
# $group.setGroup takes a group id to set as currently selected
# call $group.clearGroup when back on the group page
.factory '$group' ($ref, $timeout, $rootScope, $location)->
    result = {}
    result.object = $rootScope.$new!
    result.object.id = "default"
    result.setGroup = (groupid)!->
        result.object.id = groupid
        $timeout((-> $ref.base.child("groups/#{groupid}").on 'value' (snapshot)->
            result.object.$apply(-> 
              result.object <<< snapshot.val!
              result.object.id = groupid))
          , 0)
    result.clearGroup = !->
      result.object.name = ''
      result.object.id = ''
      $location.path('/')
    return result

# create the identifier for compatibility between people
ratingRef = (l)-> l.sort!join('')
