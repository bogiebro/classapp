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

/*New Tests Start Here
describe('Edit Acount Info', function () {
  it('should let me change my name and college'), function(){
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    //click the right thing
    element(by.id('namefield')).sendKeys('Tom Tester');
    element(by.id('')).sendKeys('Swing Space');
    element(by.id('')).sendKeys(protractor.Key.ENTER);
    //click it again, fix test
    element(by.id('namefield')).
  }

  it('should let me add a picture'), function(){
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    //drag favicon?
  }
})

//Except that the About page is a modal, so might have to use an alert text checker?
describe('About', function () {
  it('should not show the about page until clicked'), function(){
    browser.get('http://localhost:5000/');
    broswer.driver.sleep(3000);
    expect element(by.id('aboutId')).isPresent()).toBe(false);
  }
  //Have to use the prefctrl and click the button
  it('should show users the about page'), function(){
    browser.get('http://localhost:5000/');
    browser.driver.sleep(3000);
    element(by.id('aboutId')).click();
    browser.driver.sleep(3000);
    expect element(by.id('aboutId')).isPresent()).toBe(true);
  }
});

describe('FAQ', function() {
  it('should direct users to FAQ page when clicked', function() {
    //is this correct?
    broswer.get('http://localhost:5000/#/help');
    //how do I click this button?
    expect //that the page contains some phrase that's helpful
  }
});

*/



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

//describe("member search", function())
//it('should be able to find a member');
//it('should be able to drag members to a subgroup');


//describe("chat")
//Send Message, Reply

describe("files", function() {
  browser.get('http://localhost:5000/');
  element(by.repeater('class in myclasses').row(0)).click();
  //click files

  //it('should display the files page') how to get titles?
  //it('should upload files')
  //it('should be able to edit files')
}

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





