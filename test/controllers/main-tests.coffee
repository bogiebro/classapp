# http://docs.angularjs.org/guide/module
# http://docs.angularjs.org/guide/dev_guide.services.testing_services
# http://nathanleclaire.com/blog/2013/12/13/how-to-unit-test-controllers-in-angularjs-without-setting-your-hair-on-fire/
# http://www.sitepoint.com/unit-and-e2e-testing-in-angularjs/

describe "login process", ->
    beforeEach(module('App'))

    it 'should have a MainCtrl controller', inject ($rootScope, $controller)->
        scope = $rootScope.$new()
        ctrl = $controller('MainCtrl', {$scope: scope})
        expect(ctrl).toBeDefined()

    it 'should have an InfoCtrl controller', inject ($rootScope, $controller)->
        scope = $rootScope.$new()
        me = {}
        faceInstance = {}
        ctrl = $controller('InfoCtrl', {$scope: scope, me: me, $modalInstance: faceInstance})
        expect(ctrl).toBeDefined()