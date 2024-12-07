import express from "express";

const router = express.Router();

router.post("/dishes", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "restaurant") {
        return res.status(401).json({ status: "error", message: "Not authorized" });
    }

    const {
        name,
        tags,
        price,
        spiceLevel,
        ingredients,
        description
    } = req.body;

    try {
        const newDish = new req.models.Dish({
            name,
            tags,
            price,
            spiceLevel,
            ingredients,
            description,
            restaurant: req.user._id
        });

        await newDish.save();
        res.json({ status: "success", dish: newDish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Failed to add dish" });
    }
});

router.get("/dishes", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "restaurant") {
        return res.status(401).json({ status: "error", message: "Not authorized" });
    }

    try {
        const dishes = await req.models.Dish.find({ restaurant: req.user._id });
        res.json({ status: "success", dishes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Failed to fetch dishes" });
    }
});


router.put("/dishes/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "restaurant") {
        return res.status(401).json({ status: "error", message: "Not authorized" });
    }

    const { id } = req.params;
    const { name, tags, price, spiceLevel, ingredients, description } = req.body;

    try {
        const updatedDish = await req.models.Dish.findOneAndUpdate(
            { _id: id, restaurant: req.user._id },
            {
                $set: {
                    name,
                    tags,
                    price,
                    spiceLevel,
                    ingredients,
                    description
                }
            },
            { new: true }
        );

        if (!updatedDish) {
            return res.status(404).json({
                status: "error",
                message: "Dish not found or not owned by this restaurant"
            });
        }

        res.json({ status: "success", dish: updatedDish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Failed to update dish" });
    }
});


export default router;
