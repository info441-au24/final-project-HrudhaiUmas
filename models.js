import mongoose from "mongoose";
import crypto from "crypto";
let models = {}

console.log("Connecting to MongoDB");
//await mongoose.connect("mongodb+srv://hrudhaiu:__2@cluster0.c9usz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
await mongoose.connect("mongodb+srv://kushp03:IQ1MfG7XzmM3r6yM@cluster0.oq22a.mongodb.net/")

console.log("Successfully connected to mongoDB")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hashed_password: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    preferences: [String],
    dietaryRestrictions: [String],
    role: { type: String, required: true }
});

userSchema.methods.setPassword = async function(password) {
    this.salt = crypto.randomBytes(16);
    this.hashed_password = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, this.salt, 310000, 32, "sha256", (err, hashedPassword) => {
            if (err) reject(err);
            resolve(hashedPassword);
        });
    });
};

userSchema.methods.verifyPassword = async function(password) {
    const hashedPassword = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, this.salt, 310000, 32, "sha256", (err, hashedPassword) => {
            if (err) reject(err);
            resolve(hashedPassword);
        });
    });
    return crypto.timingSafeEqual(this.hashed_password, hashedPassword);
};
models.User = mongoose.model("User", userSchema);

const dishSchema = new mongoose.Schema({
    name: String,
    tags: [String],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    spiceLevel: Number,
    ingredients: [String],
    description: String,
    restaurant: String,
    location: String
});
models.Dish = mongoose.model("Dish", dishSchema);

// Below is what the restaurantSchema looks like right now. We will need to change the menu array from a hard-coded String array to an array of
// DishId"s once we make the feature to add dishes.

// {
//     "_id": {
//       "$oid": "6745692218a8c5347acbeb74"
//     },
//     "name": "Pizza on the Ave",
//     "location": "4801 24th Ave NE, Seattle WA 98105",
//     "menu": [
//       "Vegetarian Pizza",
//       "Meat-Lover"s Pizza",
//       "Pepperoni Pizza",
//       "Hawaiian Pizza"
//     ]
// }
// const restaurantSchema = new mongoose.Schema({
//     name: String,
//     location: String,
//     menu: { type: Map, of: [dishSchema] }
// });

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    cuisine: { type: String, required: true },
    website: { type: String },
    description: { type: String },
    username: { type: String, required: true, unique: true },
    hashed_password: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }],
    role: { type: String, required: true }
});

restaurantSchema.methods.setPassword = async function (password) {
    this.salt = crypto.randomBytes(16);
    this.hashed_password = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, this.salt, 310000, 32, "sha256", (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey);
        });
    });
};

restaurantSchema.methods.verifyPassword = async function (password) {
    const hashedPassword = await new Promise((resolve, reject) => {
        crypto.pbkdf2(password, this.salt, 310000, 32, "sha256", (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey);
        });
    });
    return crypto.timingSafeEqual(this.hashed_password, hashedPassword);
};
models.Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default models;