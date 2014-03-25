graph = require('fbgraph')
Firebase = require('firebase')
firebase = new Firebase(process.env.BASE)
cronJob = require('cron').CronJob

# create identifier for compatibility.
ratingRef = (l)-> l.sort!join('')

# examine every user every hour
new cronJob('1 1 * * * *', (->
  console.log('started')
  firebase.child('users').once 'value' (data)->
    users = []
    for netid, userval of data.val!
      userval.netid = netid
      users.push(userval) if userval.token
    for user1, i in users[0 til users.length - 1]
      console.log "Examining user1 #{user1.netid}"
      graph.setAccessToken(user1.token)
      for user2 in users[i+1 til users.length]
        console.log "Examining user2 #{user2.netid}"
        ratingId = ratingRef [user1.netid, user2.netid]
        err, res <- graph.fql("select uid, mutual_friend_count from user where uid = #{user2.fbid}")
        if !err and res.data.length == 1
          firebase.child("ratings/#{ratingId}").update do
            mutualFriends: res.data[0]['mutual_friend_count']
  ), null, true)

