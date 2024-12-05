import express from "express";
import models from "../../models.js";

const router = express.Router();

// Login endpoint
router.get("/login", (req, res) => {
    res.json({ status: "success" });
});

// Get user profile by ID
router.get("/:id/profile", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await models.User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.json({ status: "success", user });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ status: "error", error: err.message });
    }
});

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, preferences, dietaryRestrictions } = req.body;

        const existingUser = await models.User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: "error", message: "Username already exists" });
        }

        const newUser = new models.User({
            username,
            email,
            password,
            preferences: preferences || [],
            dietaryRestrictions: dietaryRestrictions || [],
        });

        await newUser.save();
        res.json({ status: "success", message: "User registered successfully" });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ status: "error", error: err.message });
    }
});

// Update dietary restrictions
router.post("/dietary-restrictions", async (req, res) => {
    try {
        const { username, dietaryRestrictions } = req.body;

        if (!username || !dietaryRestrictions) {
            return res.status(400).json({ status: "error", error: "Username and dietary restrictions are required" });
        }

        // Find the user and update dietary restrictions
        const user = await models.User.findOneAndUpdate(
            { username },
            { $set: { dietaryRestrictions } }, // Update dietaryRestrictions
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ status: "error", error: "User not found" });
        }

        console.log("Dietary restrictions updated for user:", user);

        res.json({
            status: "success",
            dietaryRestrictions: user.dietaryRestrictions,
        });
    } catch (err) {
        console.error("Error updating dietary restrictions:", err.message);
        res.status(500).json({ status: "error", error: err.message });
    }
});

// Get dietary restrictions for a user
router.get("/:username/dietary-restrictions", async (req, res) => {
    try {
        const { username } = req.params;

        const user = await models.User.findOne({ username });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        console.log("Fetched dietary restrictions for user:", user.dietaryRestrictions);

        res.json({
            status: "success",
            dietaryRestrictions: user.dietaryRestrictions,
        });
    } catch (err) {
        console.error("Error fetching dietary restrictions:", err.message);
        res.status(500).json({ status: "error", error: err.message });
    }
});



export default router;
