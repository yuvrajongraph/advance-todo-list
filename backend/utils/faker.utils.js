const { faker } = require("@faker-js/faker");

function createRandomUser() {
  
  const userData = {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(10),
  }
  return userData;
}

function createRandomTodo() {
   const todoData ={
    title: faker.string.sample(),
    category: faker.helpers.arrayElement(['normal', 'other','food']),
    status: faker.helpers.arrayElement(['open', 'close']),
    dateTime: faker.date.between({from: '2024-01-01T00:00:00.000Z', to:'2024-12-31T23:59:59.999Z'}).toISOString()
   }
   return todoData;
}

function createRandomAppointment() {
    const appointmentData ={
     title: faker.string.sample(),
     status: faker.helpers.arrayElement(['open', 'close']),
     startTime: faker.date.between({from: '2024-01-01T00:00:00.000Z', to:'2024-12-31T23:59:59.999Z'}).toISOString(),
     endTime: faker.date.between({from: '2025-01-01T00:00:00.000Z', to:'2025-12-31T23:59:59.999Z'}).toISOString()
    }
    return appointmentData;
 }

module.exports = {
    createRandomUser,
    createRandomTodo,
    createRandomAppointment
}