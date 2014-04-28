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
      browser.driver.sleep(3500);
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

    //Test Calendar
    //Create an Event 
    //View Test Event
    //Edit Event

    //Members
    //Search for Members

    //Chat
    //Send message, cancel message

    //Files
    //Upload File, Download File


    //Subgroup Tests

    //Add to subgroup by dragging

    //Use main group tests for members, chat, and files

    //Leave Subgroup




