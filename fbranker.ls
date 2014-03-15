graph = require('fbgraph')
Firebase = require('firebase')
firebase = new Firebase(process.env.BASE)
cronJob = require('cron').CronJob

# create identifier for compatibility.
ratingRef = (l)-> l.sort!join('')

# this won't scale. oh well
new cronJob('0 0 * * *', (->
 firebase.child('users').once 'value' (data)->
   users = filter (.token) data.val!
   for user1, i in users[0 til users.length - 1]
     graph.setAccessToken(user1.token)
     for user2 in users[i+1 til users.length]
       ratingId = ratingRef [user1.netid, user2.netid]
       err, res <- graph.fql("select uid, mutual_friend_count from user where uid = #{user2.id}")
        if !err and res.data.length == 1
          firebase.child("ratings/#{ratingId}").update do
            mutualFriends: res.data[0]['mutual_friend_count']
  ), null, true)
