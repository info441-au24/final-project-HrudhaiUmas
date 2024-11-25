import express from "express";
const router = express.Router();

import usersRouter from "./controllers/users.js";
import restaurantsRouter from "./controllers/restaurants.js";
import dishesRouter from "./controllers/dishes.js";

router.use("/users", usersRouter);
router.use("/restaurants", restaurantsRouter);
router.use("/dishes", dishesRouter);

export default router;