const { faker } = require("@faker-js/faker");

function createRandomUser() {
  
  const userData = {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(10),
  }
  return userData;
}

module.exports = {
    createRandomUser
}