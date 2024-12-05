import express from "express";
import models from "../../models.js";

const router = express.Router();

router.get("/login", (req, res) => {
    res.json({ status: "success" });
});

router.get("/:id/profile", (req, res) => {
    const userId = req.params.id;
    res.json({ status: "success" });
});

router.post("/register", async (req, res) => {
    try {
        const {
            username, email, password, preferences, dietaryRestrictions
        } = req.body;

        const newUser = new models.User({
            username: username,
            email: email,
            password: password,
            preferences: preferences,
            dietaryRestrictions: dietaryRestrictions
        });

        await newUser.save();
        res.json({ status: "success" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", error: err });
    }
});

// This endpoint is not working. Needs to be fixed
router.post("/dietary-restrictions", async (req, res) => {
    try {
        console.log("inside the dietary-restrictions endpoint");
        const { username, dietaryRestrictions } = req.body;
        console.log(username)
        console.log(dietaryRestrictions);

        // console.log(req.body);

        const user = await models.User.find({username: username})

        for(let i = 0; i < dietaryRestrictions.length; i++) {
            console.log(dietaryRestrictions[i]);
            console.log(user.dietaryRestrictions);
        }

        // user.dietaryRestrictions = dietaryRestrictions;

        user.save();
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", error: err });
    }
})

export default router;