describe("greeting users", function() {

    it('should have a splash screen', function() {
        browser.driver.get('http://localhost:5000/');
        browser.driver.getTitle().then(function(title) {
          expect(title).not.toContain('Yale')
        });
    });

    it('should direct un-loggedin users to CAS', function() {
        browser.driver.get('http://localhost:5000/main');
        browser.driver.getTitle().then(function(title) {
          expect(title).toContain('Yale')
        });
    });

    it('should direct logged-in users to the main page', function() {
        browser.driver.get('http://localhost:5000/testlogin').then( function(){
          browser.get('http://localhost:5000/');
          browser.driver.getTitle().then(function(title) {
            expect(title).not.toContain('Yale');
          })
        });
    });
    
    it('should greet users with a welcome splash', function() {
      browser.get('http://localhost:5000/');
      browser.driver.sleep(300);
      expect(element(by.id('help')).isPresent()).toBe(true);
    });

    it('should allow users to make an account', function() {
      browser.get('http://localhost:5000/');
      browser.driver.sleep(3000);
      element(by.css('body')).sendKeys(protractor.Key.ESCAPE);
      element(by.id('namefield')).sendKeys('Tester');
      element(by.id('namefield')).sendKeys(protractor.Key.ENTER);
      expect(element(by.id('namefield')).isPresent()).toBe(false);
    });

    it('should not show a splash when the user has a name', function() {
      browser.get('http://localhost:5000/');
      browser.driver.sleep(3000);
      expect(element(by.id('help')).isPresent()).toBe(false);
    });

    it('should allow adding classes', function () {
      browser.get('http://localhost:5000/');
      browser.driver.sleep(3000);
      element(by.id('searcher')).sendKeys('a\n');
      element(by.id('searcher')).sendKeys(protractor.Key.ENTER);
      browser.driver.sleep(3000);
      var all = element.all(by.repeater('class in myclasses'));
      all.then(function (arr) {
        expect(arr.length).toEqual(1);
      });
    });
});


describe('Edit Acount Info', function () {
  it('should let me change my name and college', function(){
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    element(by.id('setupUserButton')).click();
    element(by.id('namefield')).sendKeys('Tom Tester');
    element(by.id('collegefield')).sendKeys('Swing Space');
    element(by.id('collegefield')).sendKeys(protractor.Key.ENTER);
    element(by.id('setupUserButton')).click();
    expect(element(by.id('namefield'))).toContain('Tom');
  });
});

/* Add to the above
  it('should let me add a picture'), function(){
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    //drag favicon?
  }
})
*/

describe('About', function () {
  it('should not show the about page until clicked'), function(){
    browser.get('http://localhost:5000/');
    broswer.driver.sleep(3000);
    expect(element(by.id('aboutId')).isPresent()).toBe(false);
  });

  it('should show users the about page'), function(){
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    element(by.id('aboutButton')).click();
    browser.driver.sleep(3000);
    expect(element(by.id('aboutId')).isPresent()).toBe(true);
  });
});

describe('FAQ', function() {
  it('should direct users to FAQ page when clicked', function() {
    broswer.get('http://localhost:5000/');
    element(by.id('FAQButton')).click();
    expect(element(by.id('FAQTest')).isPresent()).toBe(true);
  }
});

describe("selecting groups", function() {
  beforeEach(function () {
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    element(by.repeater('class in myclasses').row(0)).click();
  });

  it('should update the ui when a class is clicked', function () {
    expect(element(by.id('groupnav')).isDisplayed()).toBeTruthy();
  });

  it('should have tester as a member', function () {
    browser.driver.sleep(3000);
    expect(
      element(by.repeater("usr in users[group.id] | userify: info | filter: my.searchtext")
      .row(0)).isPresent()).toBe(true);
  });

  it('should allow users to leave', function () {
    element(by.id('remover')).click();
    browser.driver.sleep(3000);
    expect(element(by.repeater('class in myclasses').row(0)).isPresent()).toBe(false);
  });
});


describe('adding the class back', function () {
  it('should work correctly', function () {
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    element(by.id('searcher')).sendKeys('a\n');
    element(by.id('searcher')).sendKeys(protractor.Key.ENTER);
    browser.driver.sleep(3000);
    var all = element.all(by.repeater('class in myclasses'));
    all.then(function (arr) {
      expect(arr.length).toEqual(1);
    });
  })
});

describe('subgroup functionality', function() {

  it('should be able to create a subgroup and have tester as member', function () {
    browser.get('http://localhost:5000/');
    broswer.driver.sleep(3000);
    element(by.repeater('class in myclasses').row(0)).click();
    element(by.id('newSubgroupButton')).click();
    element(by.id('setGroupName')).sendKeys('testgroupunique\n');
    element(by.id('setGroupName')).sendKeys(protractor.Key.ENTER);
    expect(element(by.repeater('subgroup in subgroups').row(0)).isPresent()).toBe(true);

    })

    //it should be able to make the group private/public
    //it('should be able to drag members to a subgroup');
    //it should be able to leave the subgroup

  })





describe('events', function () {
  beforeEach(function () {
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    element(by.repeater('class in myclasses').row(0)).click();
  });

  it('should create an event on double-click', function () {
    browser.driver.actions().doubleClick(element(by.id('newevent'))).perform();
    browser.driver.sleep(3000);
    expect(element(by.css('.myinput')).isPresent()).toBe(true);
  });
});



describe('chat', function () {
    it('should send messages', function() {
      browser.get('http://localhost:5000/');
      browser.driver.sleep(3000);
      element(by.repeater('class in myclasses').row(0)).click();
      element(by.id('chatfield')).sendKeys('testtext');
      element(by.id('chatfield')).sendKeys(protractor.Key.ENTER);
      element(by.id('chatfield')).sendKeys('testtext');
      expect()
      var all = element.all(by.repeater('class in myclasses'));
      all.then(function (arr) {
        expect(arr.length).toBeGreaterThan(0);
      });
    });
});

/*
describe('files', function () {
  //how do you drop a file?
  it('should create new documents', function() {
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);

  })
  //it('should upload files')
})
*/

describe('logout', function () {
  it ('should clear the user\'s cookie', function () {
    browser.get('http://localhost:5000/');
    element(by.id('logout')).click();
    browser.driver.get('http://localhost:5000/');
    browser.driver.getTitle().then(function(title) {
      expect(title).not.toContain('Yale');
    });
  });
});





