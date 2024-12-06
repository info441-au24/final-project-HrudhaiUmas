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

export default router;