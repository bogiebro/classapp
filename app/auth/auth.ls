angular.module("app.auth", ['firebase', 'ngCookies'])

.factory '$ref' ($cookies, $rootScope, $firebase)->
    refScope = $rootScope.$new()
    cookieData = JSON.parse($cookies.casInfo)
    netid = cookieData.netid
    firebase = new Firebase($PROCESS_ENV_FIREBASE)
    do
        error <- firebase.auth(cookieData.token)
        console.log("Login Failed!", error) if error
        $firebase(firebase.child("users/#{netid}")).$bind(refScope, "me").then (unbind)->
            $rootScope.$broadcast('newuser') if not refScope.me.name?
    refScope.base = firebase
    refScope.netid = netid
    return refScope

.factory '$trackConnected' ($ref, $firebase)->
    myConnectionsRef = $ref.base.child "users/#{$ref.netid}/connections"
    connectedRef = $ref.base.child '.info/connected'
    connectedRef.on 'value' (snap)!->
        if (snap.val!)
            myConnectionsRef.push true
            con.onDisconnect!remove!
    return (netids)->
        obj = {}
        for netid in netids
            obj[netid] = $firebase($ref.base.child("users/#{netid}/connections"))
        return obj