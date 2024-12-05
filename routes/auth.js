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

// User Strategy
passport.use(
    "user",
    new LocalStrategy(async function verify(username, password, cb) {
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
    })
);

// Restaurant Strategy
passport.use(
    "restaurant",
    new LocalStrategy(async function verify(username, password, cb) {
        try {
            const restaurant = await models.Restaurant.findOne({ username: username });

            if (!restaurant) {
                return cb(null, false, { message: "Incorrect username or password." });
            }

            const hashedPassword = await hashPassword(password, restaurant.salt);
            if (!crypto.timingSafeEqual(Buffer.from(restaurant.hashed_password), hashedPassword)) {
                return cb(null, false, { message: "Incorrect username or password." });
            }

            return cb(null, restaurant);
        } catch (err) {
            return cb(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user._id, username: user.username });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(async () => {
        try {
            const fullUser =
                (await models.User.findById(user.id)) ||
                (await models.Restaurant.findById(user.id));
            return cb(null, fullUser);
        } catch (err) {
            return cb(err);
        }
    });
});


router.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            status: "success",
            authenticated: true,
            user: {
                username: req.user.username,
                preferences: req.user.preferences,
                dietaryRestrictions: req.user.dietaryRestrictions
            }
        });
    } else {
        res.json({
            status: "success",
            authenticated: false
        });
    }
});

router.post("/", passport.authenticate("user"), (req, res) => {
    res.json({
        status: "success",
        user: {
            username: req.user.username,
            preferences: req.user.preferences,
            dietaryRestrictions: req.user.dietaryRestrictions,
        },
    });
});


router.post("/login", (req, res, next) => {
    passport.authenticate("user", (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "error",
                message: "An internal server error occurred. Please try again later.",
            });
        }
        if (!user) {
            return res.status(401).json({ status: "error", message: info.message });
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return res.status(500).json({
                    status: "error",
                    message: "An error occurred during login. Please try again later.",
                });
            }
            return res.json({ status: "success" });
        });
    })(req, res, next);
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