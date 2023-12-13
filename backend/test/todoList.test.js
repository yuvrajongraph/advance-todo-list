/* eslint-disable no-undef */
const app = require("../app.js");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const {
  createRandomUser,
  createRandomTodo,
} = require("../utils/faker.utils.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Todo = require("../models/todoList.model.js");
const { generateHashPassword } = require("../utils/bcryptFunctions.utils");
const config = require("../config/config.js");

let user;
let bearerToken;
let todoId;
let userId;
describe("create todo item test cases", () => {
  const payload = createRandomUser();
  const todoPayload1 = createRandomTodo();
  beforeAll(async () => {
    
    payload.password = generateHashPassword(payload.password);
    const data = new User(payload);
    const savedData = await data.save();
    await User.findOneAndUpdate(
      { _id: savedData._id },
      { $set: { isRegister: true } }
    );
    user = await User.findOne({ _id: savedData._id });
    bearerToken = jwt.sign({ _id: user._id }, config.JWT_SECRET);
  });

  it("tests api/todo-list create a todo item successfully", async () => {
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);
    todoId = response.body.data._id;
    userId = response.body.data.userId;
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Item has been created");
  });

  it("tests api/todo-list date less than the current date", async () => {
    todoPayload1.dateTime = "2023-01-01T00:00:00.000Z";
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "Please, choose date above or equal to current date "
    );
  });

  it("tests api/todo-list empty dateTime", async () => {
    todoPayload1.dateTime = "";
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
      "\"dateTime\" is not allowed to be empty"
    );
  });

  it("tests api/todo-list without dateTime", async () => {
    delete todoPayload1.dateTime
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"dateTime\" is required"
    );
  });

  it("tests api/todo-list wrong dateTime", async () => {
    todoPayload1.dateTime = faker.string.sample();
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"dateTime\" must be in iso format"
    );
  });

  it("tests api/todo-list empty title", async () => {
    todoPayload1.dateTime =faker.date.between({from: '2024-01-01T00:00:00.000Z', to:'2024-12-31T23:59:59.999Z'}).toISOString();
    todoPayload1.title = "";
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"title\" is not allowed to be empty"
    );
  });

  it("tests api/todo-list without title", async () => {
    delete todoPayload1.title ;
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"title\" is required"
    );
  });

  it("tests api/todo-list empty status", async () => {
    todoPayload1.title = faker.string.sample();
    todoPayload1.status="";
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"status\" must be one of [open, close]"
    );
  });

  it("tests api/todo-list empty category", async () => {
    todoPayload1.status= faker.helpers.arrayElement(['open', 'close']);
    todoPayload1.category = "";
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"category\" must be one of [normal, food, other]"
    );
  });

  it("tests api/todo-list empty category", async () => {
    delete todoPayload1.category ;
    const response = await request(app)
      .post(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"category\" is required"
    );
  });
  
});

describe("update todo item test cases", () => {
  const todoPayload1 = createRandomTodo();

  it("tests api/todo-list todoId is not long", async () => {
    const response = await request(app)
      .patch(`/api/todo-list/${'65785350a7bcd71cdd62077'}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"id\" length must be 24 characters long");
  });

  it("tests api/todo-list update a todo item successfully", async () => {
    const response = await request(app)
      .patch(`/api/todo-list/${todoId}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Item updated successfully");
  });

  it("tests api/todo-list date less than the current date", async () => {
    todoPayload1.dateTime = "2023-01-01T00:00:00.000Z";
    const response = await request(app)
      .patch(`/api/todo-list/${todoId}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "Please, choose date above or equal to current date "
    );
  });

  it("tests api/todo-list item not found", async () => {
    todoPayload1.dateTime = faker.date
      .between({
        from: "2024-01-01T00:00:00.000Z",
        to: "2024-12-31T23:59:59.999Z",
      })
      .toISOString();
    const response = await request(app)
      .patch(`/api/todo-list/${"65785350a7bcd71cdd620779"}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(todoPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Item not found");
  });
});

describe("get all todo items test cases", () => {
  it("tests api/todo-list get all todo items successfully", async () => {
    const todos = await Todo.find({ userId: userId });
    const response = await request(app)
      .get(`/api/todo-list`)
      .set("Authorization", "Bearer " + bearerToken);

    const todosWithDateString = todos.map((todo) => ({
      _id: todo._id,
      title: todo.title,
      status: todo.status,
      category: todo.category,
      dateTime: todo.dateTime.toISOString(),
      userId: todo.userId,
      __v: 0,
    }));

  
    expect(response.statusCode).toBe(200);
    //expect(JSON.stringify(response.body.data)).toBe(JSON.stringify(expect.arrayContaining(todosWithDateString)));
    expect(response.body.message).toBe("OK");
  });
});

describe("get single todo item test cases", () => {
  it("tests api/todo-list get single todo item successfully", async () => {
    const todo = await Todo.findOne({
      $and: [{ _id: todoId }, { userId: userId }],
    });
    const response = await request(app)
      .get(`/api/todo-list/${todoId}`)
      .set("Authorization", "Bearer " + bearerToken);

    const objectToMatch = {
      _id: todo._id,
      title: todo.title,
      status: todo.status,
      category: todo.category,
      dateTime: todo.dateTime.toISOString(),
      userId: todo.userId,
      __v: 0,
    };
   
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body.data)).toBe(JSON.stringify(objectToMatch));
    expect(response.body.message).toBe("OK");
  });
});

describe("delete todo item test cases", () => {
  it("tests api/todo-list delete a todo item successfully", async () => {
    const response = await request(app)
      .delete(`/api/todo-list/${todoId}`)
      .set("Authorization", "Bearer " + bearerToken);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Item deleted successfully");
  });

  it("tests api/todo-list item not found", async () => {
    const response = await request(app)
      .delete(`/api/todo-list/${"65785350a7bcd71cdd620779"}`)
      .set("Authorization", "Bearer " + bearerToken);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Item not found");
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Todo.deleteMany({});
});
