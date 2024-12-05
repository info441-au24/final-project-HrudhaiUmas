import mongoose from "mongoose";
import crypto from "crypto";
let models = {}

console.log("Connecting to MongoDB");
await mongoose.connect("mongodb+srv://kushp03:IQ1MfG7XzmM3r6yM@cluster0.oq22a.mongodb.net/")
// await mongoose.connect("mongodb+srv://nguyean:dinonugget@practice.upnhi.mongodb.net/bitemap");

console.log("Successfully connected to mongoDB")

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hashed_password: { type: Buffer, required: true },
    salt: { type: Buffer, required: true },
    preferences: [String],
    dietaryRestrictions: [String]
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
    price: Number,
    spiceLevel: Number,
    ingredients: [String],
    description: String
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
const restaurantSchema = new mongoose.Schema({
    name: String,
    location: String,
    menu: { type: Map, of: [dishSchema] }
});
models.Restaurant = mongoose.model("Restaurant", restaurantSchema);


export default models;