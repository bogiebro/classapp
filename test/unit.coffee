# http://docs.angularjs.org/guide/module
# http://docs.angularjs.org/guide/dev_guide.services.testing_services
# http://nathanleclaire.com/blog/2013/12/13/how-to-unit-test-controllers-in-angularjs-without-setting-your-hair-on-fire/
# http://www.sitepoint.com/unit-and-e2e-testing-in-angularjs/
# https://github.com/angular/protractor/blob/master/docs/getting-started.md

# tests for abstract services
describe "auth", ->
    beforeEach(module('app.auth'))
    beforeEach(module(($provide)->
      $provide.constant('$timeout', setTimeout)
      $provide.constant('$cookies', {casInfo: params.cookieData})))

    it 'should have a ref', (done)->
      inject ($ref)->
        expect($ref.netid).toBeDefined()
        $ref.base.child("users/#{$ref.netid}/props").set({name: 'Test User'}, ->
          done())

    it 'should switch groups', (done)->
      inject ($ref, $group, $rootScope)->
        $ref.base.child("groups/testgroup/props").set({
          name: 'CPSC 112',
          groupid: 'testgroup',
          classcode: 'testclass',
          parent: false
        }, (err)->
              expect(err).toBeFalsy()
              scopea = $rootScope.$new()
              scopeb = $rootScope.$new()
              scopea.group = $group.props
              scopeb.group = $group.props
              $group.setGroup('testgroup', ->
                expect(scopea.group.name).toBeDefined()
                expect(scopea.group.name).toBe(scopeb.group.name)
                done()))

    it 'should track the user himself', (done)->
      inject ($ref, $trackConnected)->
        $trackConnected($ref.base.child('online'))
        $ref.base.child('online').on 'value', (snap)->
          expect(snap.val()).toBeDefined()
          expect(snap.val()[$ref.netid]).toBeDefined()
          done()

    it 'should track track all the user\'s groups', (done)->
      inject ($ref, $users, $rootScope, $timeout)->
        $ref.base.child("groups/testgroup/users/#{$ref.netid}").set $ref.netid, (err1)->
          $ref.base.child("users/#{$ref.netid}/groups/testgroup").set 'testgroup', (err2)->
            $rootScope.$digest()
            $users.groups.$digest()
            $timeout((->
              expect($users.groups['testgroup']).toBeTruthy()
              expect($users.groups['testgroup'][$ref.netid]).toBe($ref.netid)
              done()), 4)

# test controller initialization;
# most controller functionality tested in e2e.js
describe "group sidebar", ->
  beforeEach(module('app.group'))
  beforeEach(module(($provide)->
    $provide.constant('$cookies', {casInfo: params.cookieData})))
  
  it 'should create a group controller',
    inject ($ref, $controller, $rootScope)->
      scope = $rootScope.$new()
      ctrl = $controller('GroupCtrl', {$scope: scope})
      expect(ctrl).toBeDefined()

describe "events sidebar", ->
  beforeEach(module('app.events'))
  beforeEach(module(($provide)->
    $provide.constant('$cookies', {casInfo: params.cookieData})))
  
  it 'should create a event controller',
    inject ($ref, $controller, $rootScope)->
      scope = $rootScope.$new()
      ctrl = $controller('EventsCtrl', {$scope: scope})
      expect(ctrl).toBeDefined()

describe "members page", ->
  beforeEach(module('app.members'))
  beforeEach(module(($provide)->
    $provide.constant('$cookies', {casInfo: params.cookieData})))
  
  it 'should create a event controller',
    inject ($ref, $controller, $rootScope)->
      scope = $rootScope.$new()
      ctrl = $controller('MembersCtrl', {$scope: scope})
      expect(ctrl).toBeDefined()
  
