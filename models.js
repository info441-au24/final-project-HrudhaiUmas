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

// Below is what the restaurantSchema looks like right now. We will need to change the menu array from a hard-coded String array to an array of
// DishId's once we make the feature to add dishes.

// {
//     "_id": {
//       "$oid": "6745692218a8c5347acbeb74"
//     },
//     "name": "Pizza on the Ave",
//     "location": "4801 24th Ave NE, Seattle WA 98105",
//     "menu": [
//       "Vegetarian Pizza",
//       "Meat-Lover's Pizza",
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