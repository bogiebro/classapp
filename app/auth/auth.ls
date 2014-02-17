angular.module("app.auth", ['firebase', 'ngCookies'])

.factory '$ref' ($cookies)->
    cookieData = JSON.parse($cookies.casInfo)
    firebase = new Firebase($PROCESS_ENV_FIREBASE)
    do
        error <- firebase.auth(cookieData.token)
        console.log("Login Failed!", error) if error
    return {base: firebase, netid: cookieData.netid}

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