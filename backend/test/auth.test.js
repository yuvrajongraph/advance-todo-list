/* eslint-disable no-undef */
const app = require("../app.js");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const { createRandomUser } = require("../utils/faker.utils.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const {
    generateHashPassword,
  } = require("../utils/bcryptFunctions.utils");
const config = require("../config/config.js");

let registerVerificationToken = "";
let resetPasswordToken = "";
let user;
let plainUserPassword;
let bearerToken;

describe("user register verification email test cases", () => {

  const user = createRandomUser(); 

  it("tests api/auth/signup email for signup verification successfully", async () => {
    const response = await request(app).post("/api/auth/signup").send(user);
    const getUser = await User.findOne({email: user.email});
    const token = jwt.sign(
        { email: user.email, id: getUser._id },
        config.JWT_SECRET
      );
      registerVerificationToken = token
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Link sent to email for verification");
  });

  it("tests api/auth/signup user already exist in database", async () => {
    await User.findOneAndUpdate(
        { email: user.email },
        { $set: { isRegister: true } }
      );
    const payload = {
        name: user.name,
        email: user.email,
        password : faker.internet.password(10)
    }
    const response = await request(app).post("/api/auth/signup").send(payload);
  
    expect(response.statusCode).toBe(409);
    expect(response.body.error).toBe("User already exists with this email id");
  });

  it("tests api/auth/signup  name field is empty", async () => {
    user.name = "";
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"name\" is not allowed to be empty");
  });

  it("tests api/auth/signup without the name field", async () => {
    delete user.name;
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"name\" is required");
  });

  it("tests api/auth/signup  password field is empty", async () => {
    user.name = faker.person.fullName();
    user.password = "";
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"password\" is not allowed to be empty");
  });

  it("tests api/auth/signup without the password field", async () => {
    delete user.password;
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"password\" is required");
  });

  it("tests api/auth/signup password field less than 3 characters", async () => {
    user.password = faker.internet.password(2);
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"password\" length must be at least 3 characters long");
  });

  it("tests api/auth/signup email field is empty", async () => {
    user.password = faker.internet.password(10);
    user.email = "";
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"email\" is not allowed to be empty");
  });

  it("tests api/auth/signup without the email field ", async () => {
    delete user.email;
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"email\" is required");
  });

  it("tests api/auth/signup not a valid email format ", async () => {
    user.email = faker.internet.displayName();
    const response = await request(app).post("/api/auth/signup").send(user);
    expect(response.statusCode).toBe(422);
    expect(response.body.error).toBe("\"email\" must be a valid email");
  });

});

describe("user confirm registration process test cases", () => {
    

    it("tests api/auth/signup user register successfully", async () => {
      const response = await request(app).get(`/api/auth/signup?token=${registerVerificationToken}`);
      const tokenDecoded = jwt.verify(registerVerificationToken, config.JWT_SECRET);
      const data = await User.findOne({ _id: tokenDecoded.id });
      data.isRegister = true;

      expect(response.statusCode).toBe(201);
      expect(JSON.stringify(response.body.data)).toBe(JSON.stringify(data));
      expect(response.body.message).toBe("User registration successful");
    });

    it("tests api/auth/signup token one time used", async () => {
      const response = await request(app).get(`/api/auth/signup?token=${registerVerificationToken}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.error).toBe("Access denied. Token has already been used.");
    });
  
});


describe("user login test cases", () => {
    
    const payload = createRandomUser();

    const loginPayload1 = {
        email: payload.email,
        password: payload.password
    }

    const loginPayload2 = {
        email: faker.internet.email().toLowerCase(),
        password: payload.password
    }

    const loginPayload3 = {
        email: payload.email,
        password: faker.internet.password(10)
    }

    
    
    beforeAll(async () => {
        plainUserPassword = payload.password;
        payload.password = generateHashPassword(payload.password);
        const data = new User(payload);
        const savedData = await data.save();
        await User.findOneAndUpdate(
            { _id: savedData._id },
            { $set: { isRegister: true } }
          );
          user = await User.findOne({_id:savedData._id})
    });


    it("tests api/auth/signin user login successfully", async () => {
      const response = await request(app).post(`/api/auth/signin`).send(loginPayload1);
        
      bearerToken = response.body.data.token;

      expect(response.statusCode).toBe(200);
     
      expect(JSON.stringify(response.body.data.details)).toBe(JSON.stringify(user));
      expect(response.body.message).toBe("User Login Successful");
    });

    it("tests api/auth/signin user not exists", async () => {
        const response = await request(app).post(`/api/auth/signin`).send(loginPayload2);
          
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe( "User does not exist, please sign up");
      });

      it("tests api/auth/signin password is not correct", async () => {
        const response = await request(app).post(`/api/auth/signin`).send(loginPayload3);
          
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe( "Password is incorrect");
      });

      it("tests api/auth/signin password is not correct", async () => {
        await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { isRegister: false } }
          );

        const response = await request(app).post(`/api/auth/signin`).send(loginPayload1);
          
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe( "Account not verified ");
    });
  
});

describe("user reset password email test cases", () => {
    
    it("tests api/auth/reset-password email send to user for reset password successfully", async () => {
       const response = await request(app).get(`/api/auth/reset-password`).set("Authorization", "Bearer " + bearerToken);
       const token = jwt.sign({_id: user._id, email: user.email, password: user.password},config.JWT_SECRET);
       resetPasswordToken  = token;
       expect(response.statusCode).toBe(200);
       expect(response.body.message).toBe("Link sent to email for reset password");
     });
   
 });

 describe("user reset password confirm test cases", () => {
    
    it("tests api/auth/reset-password password is not matched with old one", async () => {
        const payload1 = {
            oldPassword: faker.internet.password(10),
            newPassword: faker.internet.password(10)
        }
       const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload1);
       expect(response.statusCode).toBe(400);
       expect(response.body.error).toBe("Password is not matched with older one");
     });

     it("tests api/auth/reset-password same password both old and new", async () => {
        const payload2 = {
            oldPassword: plainUserPassword,
            newPassword: plainUserPassword
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload2);
       
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("You cannot set this password. This password is already been used");
      });

      it("tests api/auth/reset-password reset the password successfully", async () => {
        const payload3 = {
            oldPassword: plainUserPassword,
            newPassword: faker.internet.password(10)
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload3);
        expect(response.statusCode).toBe(202);
        expect(response.body.message).toBe("User password change successfully");
      });

      it("tests api/auth/reset-password empty oldPassword", async () => {
        const payload4 = {
            oldPassword: '',
            newPassword: faker.internet.password(10)
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload4);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"oldPassword\" is not allowed to be empty");
      });

      it("tests api/auth/reset-password without oldPassword", async () => {
        const payload5 = {
            newPassword: faker.internet.password(10)
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload5);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"oldPassword\" is required");
      });

      it("tests api/auth/reset-password oldPassword must contain at least 3 characters", async () => {
        const payload6 = {
            oldPassword: '11',
            newPassword: faker.internet.password(10)
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload6);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"oldPassword\" length must be at least 3 characters long");
      });

      it("tests api/auth/reset-password empty newPassword", async () => {
        const payload7 = {
            oldPassword: plainUserPassword,
            newPassword: ''
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload7);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"newPassword\" is not allowed to be empty");
      });

      it("tests api/auth/reset-password without newPassword", async () => {
        const payload8 = {
            oldPassword: plainUserPassword
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload8);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"newPassword\" is required");
      });

      it("tests api/auth/reset-password newPassword must contain at least 3 characters", async () => {
        const payload9 = {
            oldPassword: plainUserPassword,
            newPassword: '11'
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload9);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"newPassword\" length must be at least 3 characters long");
      });

      it("tests api/auth/reset-password oldPassword must contain at most 30 characters", async () => {
        const payload10 = {
            oldPassword: faker.internet.password(31),
            newPassword: faker.internet.password(10)
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload10);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"oldPassword\" length must be less than or equal to 30 characters long");
      });

      it("tests api/auth/reset-password newPassword must contain at most 30 characters", async () => {
        const payload11 = {
            oldPassword: plainUserPassword,
            newPassword: faker.internet.password(31)
        }
        const response = await request(app).post(`/api/auth/reset-password?token=${resetPasswordToken}`).set("Authorization", "Bearer " + bearerToken).send(payload11);
        expect(response.statusCode).toBe(422);
        expect(response.body.error).toBe("\"newPassword\" length must be less than or equal to 30 characters long");
      });
   
 });

describe("user logout test cases", () => {
    
   it("tests api/auth/signout user signout successfully", async () => {
      const response = await request(app).post(`/api/auth/signout`).set("Authorization", "Bearer " + bearerToken);
      
      expect(response.statusCode).toBe(202);
      expect(response.body.message).toBe("User Signout successful");
    });
  
});


  


afterAll(async () => {
    await User.deleteMany({});
});
