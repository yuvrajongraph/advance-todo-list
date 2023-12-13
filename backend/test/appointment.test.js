/* eslint-disable no-undef */
const app = require("../app.js");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const {
  createRandomUser,
  createRandomTodo,
  createRandomAppointment
} = require("../utils/faker.utils.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Appointment = require("../models/appointment.model.js");
const { generateHashPassword } = require("../utils/bcryptFunctions.utils");
const config = require("../config/config.js");

let user;
let bearerToken;
let appointmentId;
let userId;
describe("create appointment test cases", () => {
  const payload = createRandomUser();
  const appointmentPayload1 = createRandomAppointment();
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

  it("tests api/appointment create a appointment successfully", async () => {
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);
    appointmentId = response.body.data._id;
    userId = response.body.data.userId;
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Appointment has been created");
  });

  it("tests api/appointment end date less than the current date", async () => {
    appointmentPayload1.endTime = "2023-01-01T00:00:00.000Z";
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "Please, choose date above or equal to current date "
    );
  });

  it("tests api/appointment start date is more than the end date", async () => {
    appointmentPayload1.startTime = "2026-01-01T00:00:00.000Z";
    appointmentPayload1.endTime = faker.date.between({from: '2025-01-01T00:00:00.000Z', to:'2025-12-31T23:59:59.999Z'}).toISOString();
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "Please, choose start time less than the end time for an appointment"
    );
  });


  it("tests api/appointment empty startTime", async () => {
    appointmentPayload1.startTime = "";
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
      "\"startTime\" is not allowed to be empty"
    );
  });

  it("tests api/appointment without startTime", async () => {
    delete appointmentPayload1.startTime
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"startTime\" is required"
    );
  });

  it("tests api/appointment wrong startTime", async () => {
    appointmentPayload1.startTime = faker.string.sample();
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"startTime\" must be in iso format"
    );
  });

  it("tests api/appointment empty endTime", async () => {
    appointmentPayload1.startTime = faker.date.between({from: '2024-01-01T00:00:00.000Z', to:'2024-12-31T23:59:59.999Z'}).toISOString();
    appointmentPayload1.endTime = "";
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
      "\"endTime\" is not allowed to be empty"
    );
  });

  it("tests api/appointment without endTime", async () => {
    delete appointmentPayload1.endTime
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"endTime\" is required"
    );
  });

  it("tests api/appointment wrong endTime", async () => {
    appointmentPayload1.endTime = faker.string.sample();
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"endTime\" must be in iso format"
    );
  });

  it("tests api/appointment empty title", async () => {
    appointmentPayload1.endTime =faker.date.between({from: '2025-01-01T00:00:00.000Z', to:'2025-12-31T23:59:59.999Z'}).toISOString();
    appointmentPayload1.title = "";
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"title\" is not allowed to be empty"
    );
  });

  it("tests api/appointment without title", async () => {
    delete appointmentPayload1.title ;
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"title\" is required"
    );
  });

  it("tests api/appointment empty status", async () => {
    appointmentPayload1.title = faker.string.sample();
    appointmentPayload1.status="";
    const response = await request(app)
      .post(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe(
        "\"status\" must be one of [open, close]"
    );
  });

});

describe("update appointment test cases", () => {
  const appointmentPayload1 = createRandomAppointment();

  it("tests api/appointment appointmentId is not long", async () => {
    const response = await request(app)
      .patch(`/api/appointment/${'65785350a7bcd71cdd62077'}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"id\" length must be 24 characters long");
  });

  it("tests api/appointment update a appointment successfully", async () => {
    const response = await request(app)
      .patch(`/api/appointment/${appointmentId}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Appointment updated successfully");
  });

  it("tests api/appointment date less than the current date", async () => {
    appointmentPayload1.endTime = "2023-01-01T00:00:00.000Z";
    const response = await request(app)
      .patch(`/api/appointment/${appointmentId}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
      "Please, choose date above or equal to current date "
    );
  });

  it("tests api/appointment date less than the current date", async () => {
    appointmentPayload1.startTime = "2026-01-01T00:00:00.000Z";
    appointmentPayload1.endTime = faker.date
      .between({
        from: "2025-01-01T00:00:00.000Z",
        to: "2025-12-31T23:59:59.999Z",
      })
      .toISOString();
    const response = await request(app)
      .patch(`/api/appointment/${appointmentId}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe(
        "Please, choose start time less than the end time for an appointment"
    );
  });


  it("tests api/appointment item not found", async () => {
    appointmentPayload1.startTime = faker.date
      .between({
        from: "2024-01-01T00:00:00.000Z",
        to: "2024-12-31T23:59:59.999Z",
      })
      .toISOString();
    const response = await request(app)
      .patch(`/api/appointment/${"65785350a7bcd71cdd620779"}`)
      .set("Authorization", "Bearer " + bearerToken)
      .send(appointmentPayload1);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Appointment not found");
  });
});

describe("get all appointments test cases", () => {
  it("tests api/appointment get all appointments successfully", async () => {
    const appointments = await Appointment.find({ userId: userId });
    const response = await request(app)
      .get(`/api/appointment`)
      .set("Authorization", "Bearer " + bearerToken);

    const appointmentsWithDateString = appointments.map((appointment) => ({
      _id: appointment._id,
      title: appointment.title,
      status: appointment.status,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      userId: appointment.userId,
      __v: 0,
    }));

  
    expect(response.statusCode).toBe(200);
    //expect(JSON.stringify(response.body.data)).toBe(JSON.stringify(expect.arrayContaining(todosWithDateString)));
    expect(response.body.message).toBe("OK");
  });
});

describe("get single appointment test cases", () => {
  it("tests api/appointment get single appointment successfully", async () => {
    const appointment = await Appointment.findOne({
      $and: [{ _id: appointmentId }, { userId: userId }],
    });
    const response = await request(app)
      .get(`/api/appointment/${appointmentId}`)
      .set("Authorization", "Bearer " + bearerToken);

    const objectToMatch = {
      _id: appointment._id,
      title: appointment.title,
      status: appointment.status,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      userId: appointment.userId,
      __v: 0,
    };
   
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body.data)).toBe(JSON.stringify(objectToMatch));
    expect(response.body.message).toBe("OK");
  });
});

describe("delete appointment test cases", () => {
  it("tests api/appointment delete a appointment successfully", async () => {
    const response = await request(app)
      .delete(`/api/appointment/${appointmentId}`)
      .set("Authorization", "Bearer " + bearerToken);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Appointment deleted successfully");
  });

  it("tests api/appointment item not found", async () => {
    const response = await request(app)
      .delete(`/api/appointment/${"65785350a7bcd71cdd620779"}`)
      .set("Authorization", "Bearer " + bearerToken);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Appointment not found");
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await Appointment.deleteMany({});
});
