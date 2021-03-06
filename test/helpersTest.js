const { assert } = require('chai');
const { findUserByEmail } = require('../helpers.js');

const testUsers = {
    "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "abc"
    },
    "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "cba"
    }
};

/*--------------------------------------------------------------------------------------------*/
describe('getUserByEmail', function() {

  it('Should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('Should return undefined if the email is non-existent', function() {
    const user = getUserByEmail("thanks@abc.com", testUsers);
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});