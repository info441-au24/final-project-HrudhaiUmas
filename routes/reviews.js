// routes/reviews.js
import express from "express";
import models from "../models.js";

const router = express.Router();


const isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ status: "error", message: "Not authenticated" });
    }
    next();
};

router.post("/:dishId", isAuthenticated, async (req, res) => {
    const { dishId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user._id;

    if (!comment || !rating) {
        return res.status(400).json({ status: "error", message: "Comment and rating are required." });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ status: "error", message: "Rating must be between 1 and 5." });
    }

    try {
        const dish = await models.Dish.findById(dishId);
        if (!dish) {
            return res.status(404).json({ status: "error", message: "Dish not found." });
        }

        const newReview = new models.Review({
            comment,
            rating,
            user: userId,
            dish: dishId
        });

        await newReview.save();

        dish.reviews.push(newReview._id);
        await dish.save();

        res.status(201).json({ status: "success", review: newReview });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ status: "error", message: "Failed to add review." });
    }
});


router.get("/:dishId", async (req, res) => {
    const { dishId } = req.params;

    try {
        const dish = await models.Dish.findById(dishId);
        if (!dish) {
            return res.status(404).json({ status: "error", message: "Dish not found." });
        }
        const reviews = await models.Review.find({ dish: dishId })
            .populate("user", "username")
            .sort({ createdAt: -1 });

        res.json({ status: "success", reviews });
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ status: "error", message: "Failed to fetch reviews." });
    }
});

// Edit a review
router.put("/:reviewId", isAuthenticated, async (req, res) => {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;
    const userId = req.user._id;

    if (!comment || !rating) {
        return res.status(400).json({ status: "error", message: "Comment and rating are required." });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ status: "error", message: "Rating must be between 1 and 5." });
    }

    try {
        const review = await models.Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ status: "error", message: "Review not found." });
        }

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ status: "error", message: "Unauthorized to edit this review." });
        }

        review.comment = comment;
        review.rating = rating;
        await review.save();

        res.status(200).json({ status: "success", review });
    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ status: "error", message: "Failed to update review." });
    }
});

// Delete a review
router.delete("/:reviewId", isAuthenticated, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    try {
        const review = await models.Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ status: "error", message: "Review not found." });
        }

        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ status: "error", message: "Unauthorized to delete this review." });
        }

        await models.Review.findByIdAndDelete(reviewId);

        await models.Dish.updateOne(
            { _id: review.dish },
            { $pull: { reviews: reviewId } }
        );

        res.status(200).json({ status: "success", message: "Review deleted successfully." });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ status: "error", message: "Failed to delete review." });
    }
});



// router.get("/user/:username", async (req, res) => {
//     const { username } = req.params;

//     try {
//         const user = await models.User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }

//         const reviews = await models.Review.find({ user: user._id })
//             .populate("dish", "name")
//             .sort({ createdAt: -1 });

//         res.json({
//             status: "success",
//             reviews: reviews.map((review) => ({
//                 _id: review._id,
//                 comment: review.comment,
//                 rating: review.rating,
//                 createdAt: review.createdAt,
//                 dishName: review.dish?.name || "Unknown Dish",
//             })),
//         });
//     } catch (err) {
//         console.error("Error fetching user reviews:", err);
//         res.status(500).json({ status: "error", message: "Error fetching reviews." });
//     }
// });

router.get("/user/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await models.User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Populate the full dish object
        const reviews = await models.Review.find({ user: user._id })
            .populate("dish", "name _id") // Populate both the name and _id of the dish
            .sort({ createdAt: -1 });

        // Return the full `dish` object in the response
        res.json({
            status: "success",
            reviews: reviews.map((review) => ({
                _id: review._id,
                comment: review.comment,
                rating: review.rating,
                createdAt: review.createdAt,
                dish: review.dish, // Return the full dish object
            })),
        });
    } catch (err) {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ status: "error", message: "Error fetching reviews." });
    }
});


export default router;