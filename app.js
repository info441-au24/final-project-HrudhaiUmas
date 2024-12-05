import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";

import models from "./models.js";
import apiRouter from "./routes/api.js";
import authRouter from "./routes/auth.js";
import restaurantRoutes from './routes/controllers/restaurants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "dinonugget",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: oneDay }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    req.models = models;
    next();
});

// API routes should come before the static/catch-all routes
app.use("/api", apiRouter);
app.use("/login", authRouter);
app.use("/restaurant", restaurantRoutes);

app.use(passport.authenticate("session"));

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

export default app;