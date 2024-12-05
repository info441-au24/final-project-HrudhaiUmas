import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import models from "../models.js";

const router = express.Router();

async function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, hashedPassword) => {
            if (err) reject(err);
            resolve(hashedPassword);
        });
    });
}

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const user = await models.User.findOne({ username: username });

        if (!user) {
            return cb(null, false, { message: "Incorrect username or password." });
        }

        const hashedPassword = await hashPassword(password, user.salt);
        if (!crypto.timingSafeEqual(Buffer.from(user.hashed_password), hashedPassword)) {
            return cb(null, false, { message: "Incorrect username or password." });
        }

        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user._id, username: user.username });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(async () => {
        try {
            const fullUser = await models.User.findById(user.id);
            return cb(null, fullUser);
        } catch (err) {
            return cb(err);
        }
    });
});

router.post("/", passport.authenticate("local"), (req, res) => {
    res.json({
        status: "success",
        user: {
            username: req.user.username,
            preferences: req.user.preferences,
            dietaryRestrictions: req.user.dietaryRestrictions
        }
    });
});

router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await models.User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Username already exists" });
        }

        const newUser = new models.User({
            username: username,
            preferences: [],
            dietaryRestrictions: []
        });
        await newUser.setPassword(password);
        await newUser.save();

        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Error logging in after signup"
                });
            }
            res.json({
                status: "success",
                user: {
                    username: newUser.username,
                    preferences: newUser.preferences,
                    dietaryRestrictions: newUser.dietaryRestrictions
                }
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", error: err });
    }
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Error logging out"
            });
        }
        res.json({ status: "success", message: "Logged out successfully" });
    });
});

export default router;