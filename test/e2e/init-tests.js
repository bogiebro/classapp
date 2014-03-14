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
          browser.get('http://localhost:5000/')
          browser.driver.getTitle().then(function(title) {
            expect(title).not.toContain('Yale');
          })
        });
    });
});
