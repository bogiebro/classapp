# http://docs.angularjs.org/guide/module
# http://docs.angularjs.org/guide/dev_guide.services.testing_services
# http://nathanleclaire.com/blog/2013/12/13/how-to-unit-test-controllers-in-angularjs-without-setting-your-hair-on-fire/
# http://www.sitepoint.com/unit-and-e2e-testing-in-angularjs/
# https://github.com/angular/protractor/blob/master/docs/getting-started.md

describe "login process", ->
    beforeEach(module('App'))

    it 'should have a MainCtrl controller', inject ($rootScope, $controller)->
        scope = $rootScope.$new()
        firebase = new Firebase('https://torid-fire-3655.firebaseio.com')
        ref = {base: firebase, netid: 'fake32'}
        ctrl = $controller('MainCtrl', {$scope: scope, $ref: ref})
        expect(ctrl).toBeDefined()

    it 'should have an InfoCtrl controller', inject ($rootScope, $controller)->
        scope = $rootScope.$new()
        me = {}
        faceInstance = {}
        ctrl = $controller('InfoCtrl', {$scope: scope, me: me, $modalInstance: faceInstance})
        expect(ctrl).toBeDefined()