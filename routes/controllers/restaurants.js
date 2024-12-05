import express from "express";
const router = express.Router();
import models from "../../models.js";
import crypto from "crypto";


router.get("/dishes", (req, res) => {
    res.json({ status: "success" });
});

router.post("/dishes", async (req, res) => {
    try {
        const {
            name, tags, price, spiceLevel, ingredients, description
        } = req.body;

        const newDish = new models.Dish({
            name: name,
            tags: tags,
            price: price,
            spiceLevel: spiceLevel,
            ingredients: ingredients,
            description: description
        });

        await newDish.save();
        res.json({ status: "success", error: err });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", error: err });
    }
});

// Restaurant Registration Endpoint
router.post("/register", async (req, res) => {
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
            password,
        } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: "error", message: "Username and password are required." });
        }

        const existingRestaurant = await models.Restaurant.findOne({ username });
        if (existingRestaurant) {
            return res.status(400).json({ status: "error", message: "Username already exists." });
        }

        const salt = crypto.randomBytes(16);
        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 310000, 32, "sha256", (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey);
            });
        });

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
            hashed_password: hashedPassword,
            salt: salt,
        });

        await newRestaurant.save();

        res.json({ status: "success", message: "Restaurant registered successfully!" });
    } catch (err) {
        console.error("Error registering restaurant:", err);
        res.status(500).json({ status: "error", message: "An error occurred while registering the restaurant." });
    }
});

// Restaurant Login Endpoint
router.post("/restaurant/login", (req, res, next) => {
    passport.authenticate("restaurant", (err, user, info) => {
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


router.post("/restaurant/login", (req, res, next) => {
    passport.authenticate("restaurant", (err, user, info) => {
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

export default router;