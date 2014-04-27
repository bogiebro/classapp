Firebase = require('firebase')
async = require('async')
firebase = new Firebase(process.env.BASE)
firebase.auth(process.env.GENSECRET)

firebase.child('classnames').once 'value' (data)->
  cs = data.val!
  async.each(Object.keys(cs), ((key, callback)->
    c = cs[key]
    if (c.code)
      childRef = firebase.child("tests/#{process.env.UUID}/groups/#{c.maingroup}/props").set({
        classcode: c.code,
        groupid: c.maingroup,
        name: c.name,
        parent: false}, (err)-> callback(err))), -> process.exit(0))
