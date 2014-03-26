# http://docs.angularjs.org/guide/module
# http://docs.angularjs.org/guide/dev_guide.services.testing_services
# http://nathanleclaire.com/blog/2013/12/13/how-to-unit-test-controllers-in-angularjs-without-setting-your-hair-on-fire/
# http://www.sitepoint.com/unit-and-e2e-testing-in-angularjs/
# https://github.com/angular/protractor/blob/master/docs/getting-started.md

describe "auth", ->
    beforeEach(module('App'))
    beforeEach(module(($provide)->
      $provide.constant('$cookies', {casInfo: params.cookieData})))

    it 'should have a ref', inject ($ref)->
      expect($ref.netid).toBeDefined()

    it 'should switch groups', inject ($ref, $group, $rootScope)->
      $ref.base.child("group/testgroup").set({name: 'CPSC 112'})
      scopea = $rootScope.$new()
      scopeb = $rootScope.$new()
      scopea.group = $group.props
      scopeb.group = $group.props
      $group.props.name = 'testgroup'
      $rootScope.$digest()
      expect(scopea.group.name).toBeDefined()
      expect(scopea.group.name).toBe(scopeb.group.name)

    it 'should track the user himself', (done)->
      inject ($ref, $trackConnected)->
        $trackConnected($ref.base.child('online'))
        $ref.base.child('online').on 'value', (snap)->
          expect(snap.val()[$ref.netid]).toBeDefined()
          done()

    it 'should track track all the user\'s groups', (done)->
      inject ($ref, $users)->
        $ref.base.child('group/testgroup/users').push $ref.netid, (err1)->
          $ref.base.child("users/#{$ref.netid}/groups").push 'testgroup', (err2)->
            expect($users.groups['testgroup'].indexOf($ref.netid)).toBeTruthy()
            done()

