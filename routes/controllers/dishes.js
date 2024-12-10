import express from "express";
import models from "../../models.js";

const router = express.Router();

// // Search endpoint with dietary restrictions
// router.get("/search", async (req, res) => {
//     const { food, username } = req.query;

//     if (!food) {
//         return res.status(400).json({ status: "error", error: "Missing 'food' query parameter" });
//     }

//     try {
//         let dietaryRestrictions = [];

//         // Fetch dietary restrictions if username is provided
//         if (username) {
//             const user = await req.models.User.findOne({ username });
//             if (!user) {
//                 return res.status(404).json({ status: "error", error: "User not found" });
//             }
//             dietaryRestrictions = user.dietaryRestrictions || [];
//         }

//         // Query to fetch dishes based on name and dietary restrictions
//         const query = {
//             name: { $regex: food, $options: "i" } // Case-insensitive search
//         };

//         if (dietaryRestrictions.length > 0) {
//             query.tags = { $in: dietaryRestrictions }; // Match dishes with any of the dietary restriction tags
//         }

//         const searchResults = await req.models.Dish.find(query);

//         const searchResultsJSON = searchResults.map((dish) => ({
//             id: dish.id,
//             name: dish.name,
//             tags: dish.tags,
//             ingredients: dish.ingredients,
//             spiceLevel: dish.spiceLevel,
//             restaurant: dish.restaurant,
//             location: dish.location,
//         }));

//         return res.json(searchResultsJSON);
//     } catch (error) {
//         console.error("Error fetching search results:", error.message);
//         res.status(500).json({ status: "error", error: error.message });
//     }
// });

router.get("/search", async (req, res) => {
    const { food, username } = req.query;

    if (!food) {
        return res.status(400).json({ status: "error", error: "Missing 'food' query parameter" });
    }

    try {
        let dietaryRestrictions = [];

        // Fetch dietary restrictions if username is provided
        if (username) {
            const user = await models.User.findOne({ username });
            if (!user) {
                return res.status(404).json({ status: "error", error: "User not found" });
            }
            dietaryRestrictions = user.dietaryRestrictions || [];
        }

        // Query to fetch dishes based on name and dietary restrictions
        const query = {
            name: { $regex: food, $options: "i" }, // Case-insensitive search
        };

        if (dietaryRestrictions.length > 0) {
            query.tags = { $in: dietaryRestrictions }; // Match dishes with dietary restriction tags
        }

        const searchResults = await models.Dish.find(query).populate("restaurant"); // Populate restaurant details

        const searchResultsJSON = searchResults.map((dish) => ({
            id: dish.id,
            name: dish.name,
            tags: dish.tags,
            ingredients: dish.ingredients,
            spiceLevel: dish.spiceLevel,
            restaurant: dish.restaurant?.name || "Unknown", // Populate restaurant name
            location: `${dish.restaurant?.address || ""}, ${dish.restaurant?.city || ""}, ${dish.restaurant?.state || ""}`, // Full address
        }));

        return res.json(searchResultsJSON);
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
router.post("/tag", async (req, res) => {
    try {
        const { _id, tags } = req.body;

        if(!_id || !tags) {
            return res.status(400).json({
                status: "error",
                error: "Username or tags not provided"
            })
        }

        const dish = await req.models.Dish.findOneAndUpdate(
            { _id }, 
            { $set: { tags }},
            { new: true }
        )

        if (!dish) {
            return res.status(404).json({ status: "error", error: "Dish not found" });
        }

        console.log("Tags updated for dish:", dish);

        res.json({
            status: "success",
            tags: dish.tags
        })
    } catch (error) {
        console.error("Error updating tags: ", error.message);
        res.status(500).json({ status: "error", error: error.message});
    }
});

router.get("/details", async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({
            status: "error",
            error: "Missing 'id' query parameter",
        });
    }

    try {
        const dish = await models.Dish.findById(id).populate("restaurant", "name address city state zip");

        if (!dish) {
            return res.status(404).json({ status: "error", message: "Dish not found." });
        }

        res.json([dish]);
    } catch (error) {
        console.error("Error fetching dish details: ", error.message);
        res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
});


router.get("/search", async (req, res) => {
    const { food } = req.query;

    try {
        const dishes = await models.Dish.find({ name: { $regex: food, $options: "i" } })
            .populate("reviews");

        const dishesWithRatings = dishes.map((dish) => {
            return {
                ...dish.toObject(),
                averageRating: dish.averageRating,
            };
        });

        res.json(dishesWithRatings);
    } catch (err) {
        console.error("Error fetching dishes:", err);
        res.status(500).json({ error: "Failed to fetch dishes." });
    }
});

export default router;
