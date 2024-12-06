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
        cb(null, {
            id: user._id,
            username: user.username,
            role: user.role
        });
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(async () => {
        try {
            const Model = user.role === "restaurant" ? models.Restaurant : models.User;
            const fullUser = await Model.findById(user.id);
            return cb(null, fullUser);
        } catch (err) {
            return cb(err);
        }
    });
});

router.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
        const userResponse = {
            status: "success",
            authenticated: true,
            user: {
                username: req.user.username,
                role: req.user.role
            }
        };

        if (req.user.role === "restaurant") {
            userResponse.user = {
                ...userResponse.user,
                name: req.user.name,
                email: req.user.email,
                cuisine: req.user.cuisine
            };
        } else {
            userResponse.user = {
                ...userResponse.user,
                preferences: req.user.preferences,
                dietaryRestrictions: req.user.dietaryRestrictions
            };
        }

        res.json(userResponse);
    } else {
        res.json({
            status: "success",
            authenticated: false
        });
    }
});

router.post("/login", (req, res, next) => {
    const loginType = req.body.role || "user";
    passport.authenticate(loginType, (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                status: "error",
                message: "An internal server error occurred. Please try again later.",
            });
        }
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: info.message
            });
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

router.post("/user/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await models.User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Username already exists" });
        }

        const newUser = new models.User({
            username: username,
            preferences: [],
            dietaryRestrictions: [],
            role: "user"
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
                status: "success"
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", error: err });
    }
});

router.post("/restaurant/signup", async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            zip,
            cuisine,
            website,
            description,
            username,
            password
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: "error", message: "Username and password are required." });
        }

        const existingRestaurant = await models.Restaurant.findOne({ username });
        if (existingRestaurant) {
            return res.status(400).json({ status: "error", message: "Username already exists." });
        }

        const newRestaurant = new models.Restaurant({
            name,
            email,
            phone,
            address,
            city,
            state,
            zip,
            cuisine,
            website,
            description,
            username,
            role: "restaurant"
        });
        await newRestaurant.setPassword(password)
        await newRestaurant.save();

        req.login(newRestaurant, (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Error logging in after registration"
                });
            }
            res.json({
                status: "success"
            });
        });
    } catch (err) {
        console.error("Error registering restaurant:", err);
        res.status(500).json({ status: "error", message: "An error occurred while registering the restaurant." });
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