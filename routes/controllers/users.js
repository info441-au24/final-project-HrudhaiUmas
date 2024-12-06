import express from "express";

const router = express.Router();

// Update dietary restrictions
router.post("/dietary-restrictions", async (req, res) => {
    try {
        const { username, dietaryRestrictions } = req.body;

        if (!username || !dietaryRestrictions) {
            return res.status(400).json({ status: "error", error: "Username and dietary restrictions are required" });
        }

        // Find the user and update dietary restrictions
        const user = await req.models.User.findOneAndUpdate(
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

        const user = await req.models.User.findOne({ username });

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
