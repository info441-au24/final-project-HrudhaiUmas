import mongoose from "mongoose";

let models = {}

console.log("Connecting to MongoDB");
await mongoose.connect('mongodb+srv://kushp03:IQ1MfG7XzmM3r6yM@cluster0.oq22a.mongodb.net/')

console.log("Successfully connected to mongoDB")

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String, // typically password's arent stored in db's, do we want to find a different way or stick w this?
    preferences: [String], // what is preferences an array of
    dietaryRestrictions: [String]
});
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

const restaurantSchema = new mongoose.Schema({
    name: String,
    location: String,
    menu: { type: Map, of: [dishSchema] }
});
models.Restaurant = mongoose.model("Restaurant", restaurantSchema);


export default models;