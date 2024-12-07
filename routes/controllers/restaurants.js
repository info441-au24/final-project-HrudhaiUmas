import express from "express";

const router = express.Router();

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

router.post("/dishes", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "restaurant") {
        return res.status(401).json({ status: "error", message: "Not authorized" });
    }

    const { name, tags, price, spiceLevel, ingredients, description } = req.body;

    try {
        const newDish = new req.models.Dish({
            name,
            tags,
            price,
            spiceLevel,
            ingredients,
            description,
            restaurant: req.user._id,
        });

        await newDish.save();
        
        await req.models.Restaurant.findByIdAndUpdate(req.user._id, {
            $push: { menu: newDish._id },
        });

        res.json({ status: "success", dish: newDish });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Failed to add dish" });
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

router.put("/", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "restaurant") {
      return res.status(401).json({ status: "error", message: "Not authorized" });
    }
  
    const { name, email, phone, address, city, state, zip, cuisine, website, description } = req.body;
  
    try {
      const updatedRestaurant = await req.models.Restaurant.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            name, email, phone, address, city, state, zip, cuisine, website, description
          }
        },
        { new: true }
      );
  
      if (!updatedRestaurant) {
        return res.status(404).json({ status: "error", message: "Restaurant not found" });
      }
  
      res.json({ status: "success", restaurant: updatedRestaurant });
    } catch (err) {
      console.error("Error updating restaurant:", err);
      res.status(500).json({ status: "error", message: "Failed to update restaurant" });
    }
  });
  

router.get("/all", async (req, res) => {
    try {
        const restaurants = await req.models.Restaurant.find({}, "-hashed_password -salt");
        res.json({ status: "success", restaurants });
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch restaurants" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const restaurant = await req.models.Restaurant.findById(req.params.id, "-hashed_password -salt").populate({
            path: "menu",
            model: "Dish", 
        });
        if (!restaurant) {
            return res.status(404).json({ status: "error", message: "Restaurant not found" });
        }
        res.json({ status: "success", restaurant });
    } catch (error) {
        console.error("Error fetching restaurant profile:", error);
        res.status(500).json({ status: "error", message: "Failed to fetch restaurant profile" });
    }
});



export default router;
