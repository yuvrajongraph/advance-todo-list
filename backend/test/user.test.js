/* eslint-disable no-undef */
const app = require("../app.js");
const request = require("supertest");
const jwt = require('jsonwebtoken')
const fs = require('fs');


const { createRandomUser } = require("../utils/faker.utils.js");

const User = require("../models/user.model");

const { generateHashPassword } = require("../utils/bcryptFunctions.utils");
const config = require("../config/config.js");

let user;
let bearerToken;

describe("get single user test cases", () => {
  const payload = createRandomUser();

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

  it("tests api/user get single user  successfully", async () => {
    const getSingleUser = await User.findOne({ _id: user._id });
    const response = await request(app)
      .get(`/api/user`)
      .set("Authorization", "Bearer " + bearerToken);

    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body.data)).toBe(JSON.stringify(getSingleUser));
    expect(response.body.message).toBe("User found");
  });
});

describe("upload an image", () => {
  
    it("tests api/user/upload-image upload an image successfully", async () => {
        
        const filePath =  __dirname + `/../uploads/myImage-1700823195629WIN_20230430_16_55_10_Pro.jpg`; 
        const fileStream = fs.createReadStream(filePath); 
      
        const formData = new FormData();
        formData.append('file', fileStream);

        const response = await request(app)
        .post(`/api/user/upload-image`).attach('myImage', fileStream)
        .set("Authorization", "Bearer " + bearerToken);
  
        await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { url: response.body.data.imageLink } },
            { new: true }
          );

      const getSingleUser = await User.findOne({ _id: user._id });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.imageLink).toBe(getSingleUser.url);
      expect(response.body.message).toBe(" Profile Image updated successfully");
    });
  });
  

afterAll(async () => {
  await User.deleteMany({});
});
