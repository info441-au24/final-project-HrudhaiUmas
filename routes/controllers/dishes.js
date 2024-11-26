import express from "express";
import models from "../../models.js";
const router = express.Router();

// i think filter and search can be combined into one
router.get("/search", async (req, res) => {
    const food = req.query.food;

    try {
        const allDishes = await models.Dish.find();

        const searchResults = await Promise.all(
            allDishes.filter(async (dish) => {
                console.log("Dish Name: ", dish.name);
                console.log("Does dish have food in it?", dish.name.includes(food));
                dish.name.includes(food)
            })
        )

        const searchResultsJSON = await Promise.all(
            searchResults.map(async (dish) => {
                return {
                    name: dish.name
                }
            })
        )

        console.log(searchResultsJSON);

        res.json(searchResultsJSON);
    } catch (error) {
        console.log("error message: ", error.message);
        res.status(500).json({ status: "error", error: error.message })
    }
});

router.post("/tag", (req, res) => {

})

export default router;