# http://docs.angularjs.org/guide/module
# http://docs.angularjs.org/guide/dev_guide.services.testing_services
# http://nathanleclaire.com/blog/2013/12/13/how-to-unit-test-controllers-in-angularjs-without-setting-your-hair-on-fire/
# http://www.sitepoint.com/unit-and-e2e-testing-in-angularjs/
# https://github.com/angular/protractor/blob/master/docs/getting-started.md


describe "controller", ->
    beforeEach(module('App'))

    it 'should have a MainCtrl controller', inject ($rootScope, $controller)->
        scope = $rootScope.$new()
        ctrl = $controller('MainCtrl', {$scope: scope, $firebase: fireStub, $ref: refStub})
        expect(ctrl).toBeDefined()

    it 'should have an InfoCtrl controller', inject ($rootScope, $controller)->
        scope = $rootScope.$new()
        me = {}
        faceInstance = {}
        ctrl = $controller('InfoCtrl', {$scope: scope, me: me, $modalInstance: faceInstance})
        expect(ctrl).toBeDefined()

refStub =
    netid: 'test23'
    base: jasmine.createSpyObj('base', ['set', 'child'])

angFireStub = jasmine.createSpyObj('angFire', ['$add'])
angFireStub['$add'] = jasmine.createSpyObj('adder', ['$then'])
fireStub = (arg...)-> angFireStub

fbStub = jasmine.createSpyObj('fb', ['login'])