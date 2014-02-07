require! <[ https ]>

casUrl = "https://secure.its.yale.edu/cas"

makeUrl = (req)-> encodeURIComponent("http://#{req.get('host')}#{req.path}")

exports.checkCookie = (makeToken, req, res, next)-->
    | req.cookies.casInfo? => next!
    | req.query.ticket? =>
        validateUrl = "#{casUrl}/validate?service=#{makeUrl req}&ticket=#{req.query.ticket}"
        https.get(validateUrl, (r)->
            buf = ''
            r.on('data', (chunk)-> buf += chunk.toString('utf8'))
            r.on 'end', ->
                results = buf.split('\n')
                if (results[0] === 'yes')
                    res.cookie('casInfo', makeToken(results[1]), {})
                    res.redirect(req.path)
                else res.send 400
            ).on('error', (e)->
                res.send 500)
    | otherwise =>
        res.redirect("#{casUrl}/login?service=#{makeUrl req}")

