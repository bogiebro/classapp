describe("greeting users", function() {
    it('should have a splash screen', function() {
        browser.driver.get('http://localhost:5000/');
    });
    it('should direct un-loggedin users to CAS', function() {
        browser.driver.get('http://localhost:5000/auth');
    });
    it('should direct logged-in users to the main page', function() {
        browser.driver.get('http://localhost:5000/testlogin');
        browser.get('http://localhost:5000/auth');
    });
});