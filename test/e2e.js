.describe("greeting users", function() {
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
    //Account Creation Tests
    //Upload Picture
    it('should direct logged-in users to the main page', function() {
        browser.driver.get('http://localhost:5000/testlogin').then( function(){
          browser.get('http://localhost:5000/')
          browser.driver.getTitle().then(function(title) {
            expect(title).not.toContain('Yale');
          })
        });
    });
    //Test FAQ, About Page
    //Edit Account info


    //Search should be able to display classes (test input)

    //Add Class (as many as we want but at least 2) (maybe we can create a fake test class)

    //Switch Main Groups in Group Sidebar

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


    //Leave Group

    //log out of application

});
