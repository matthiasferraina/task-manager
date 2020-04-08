const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "test",
    email: "test.test@gmail.com",
    password: "Matthias123",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    }, ],
};

beforeEach(async() => {
    await User.deleteMany();
    await new User(userOne).save();
});

test("Should signup a new user", async() => {
    response = await request(app)
        .post("/users")
        .send({
            name: "Matthias",
            email: "ferraina.matthias@gmail.com",
            password: "Matthias123",
        })
        .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: "Matthias",
            email: "ferraina.matthias@gmail.com",
        },
        token: user.tokens[0].token,
    });

    expect(user.password).not.toBe("Matthias123");
});

test("Should login existing user", async() => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: "test.test@gmail.com",
            password: "Matthias123",
        })
        .expect(200);

    const user = await User.findById(
        response.body.user._id
    );
    expect(response.body.token).toBe(user.tokens[1].token)

});

test("Should not login existing user", async() => {
    await request(app)
        .post("/users/login")
        .send({
            email: "test.tet@gmail.com",
            password: "Matthias123",
        })
        .expect(400);
});

test("Should get profile for user", async() => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for user", async() => {
    await request(app).get("/users/me").send().expect(401);
});

test("should delete account for user", async() => {
    const response = await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(response.body._id)
    expect(user).toBeNull()
});

test("should not delete account for user", async() => {
    await request(app).delete("/users/me").send().expect(401);
});