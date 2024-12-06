import express from "express";

const router = express.Router();

// Search endpoint with dietary restrictions
router.get("/search", async (req, res) => {
    const { food, username } = req.query;

    if (!food) {
        return res.status(400).json({ status: "error", error: "Missing 'food' query parameter" });
    }

    try {
        let dietaryRestrictions = [];

        // Fetch dietary restrictions if username is provided
        if (username) {
            const user = await req.models.User.findOne({ username });
            if (!user) {
                return res.status(404).json({ status: "error", error: "User not found" });
            }
            dietaryRestrictions = user.dietaryRestrictions || [];
        }

        // Query to fetch dishes based on name and dietary restrictions
        const query = {
            name: { $regex: food, $options: "i" } // Case-insensitive search
        };

        if (dietaryRestrictions.length > 0) {
            query.tags = { $in: dietaryRestrictions }; // Match dishes with any of the dietary restriction tags
        }

        const searchResults = await req.models.Dish.find(query);

        const searchResultsJSON = searchResults.map((dish) => ({
            name: dish.name,
            tags: dish.tags,
            ingredients: dish.ingredients,
            spiceLevel: dish.spiceLevel,
        }));

        res.json(searchResultsJSON);
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        res.status(500).json({ status: "error", error: error.message });
    }
});

// Surprise endpoint with dietary restrictions
router.get("/surprise", async (req, res) => {
    const { username } = req.query;

    try {
        let dietaryRestrictions = [];

        // Fetch dietary restrictions if username is provided
        if (username) {
            const user = await req.models.User.findOne({ username });
            if (!user) {
                return res.status(404).json({ status: "error", error: "User not found" });
            }
            dietaryRestrictions = user.dietaryRestrictions || [];
        }

        // Query to fetch dishes based on dietary restrictions
        const query = dietaryRestrictions.length > 0 ? { tags: { $in: dietaryRestrictions } } : {};

        const dishes = await req.models.Dish.find(query); // Get all dishes that match the query
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
