import express from "express";
import models from "../../models.js";
const router = express.Router();

// Search endpoint
router.get("/search", async (req, res) => {
    const { food } = req.query;

    if (!food) {
        return res.status(400).json({ status: "error", error: "Missing 'food' query parameter" });
    }

    try {
        const searchResults = await models.Dish.find({
            name: { $regex: food, $options: "i" } // Case-insensitive search
        });

        const searchResultsJSON = searchResults.map((dish) => ({
            name: dish.name
        }));

        res.json(searchResultsJSON);
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        res.status(500).json({ status: "error", error: error.message });
    }
});

// Surprise endpoint
router.get("/surprise", async (req, res) => {
    try {
        const dishes = await models.Dish.find(); // Get all dishes from the database
        if (!dishes.length) {
            return res.status(404).json({ suggestion: "No dishes available" });
        }

        const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
        res.json({ suggestion: randomDish.name });
    } catch (error) {
        console.error("Error fetching random dish:", error.message);
        res.status(500).json({ suggestion: "Error fetching suggestion" });
    }
});

// Placeholder for /tag endpoint
router.post("/tag", (req, res) => {
    // TODO: Implement this endpoint in the future if needed
    res.status(501).json({ status: "error", message: "Not implemented" });
});

export default router;
