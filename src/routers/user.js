const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = new express.Router();

router.post("/users", async(req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/login", async(req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.post("/users/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            token => token.token !== req.token
        );
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/users/logoutAll", auth, async(req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});
// router.get("/users", auth, async(req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

router.get("/users/me", auth, async(req, res) => {
    res.send(req.user);
});

router.get("/users/:id", async(req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(err);
    }
});

router.patch("/users/:id", async(req, res) => {
    const updateFields = Object.keys(req.body);
    const acceptedFields = ["name", "age", "email", "password"];
    const validOperation = updateFields.every(field =>
        acceptedFields.includes(field)
    );

    if (!validOperation) {
        return res.status(401).send({ error: "Invalid update !" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        updateFields.forEach(field => (user[field] = req.body[field]));

        await user.save();

        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/users/:id", async(req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(e);
    }
});

module.exports = router;