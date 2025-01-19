// /db/index.js
const mongoose = require("mongoose");
const DB_NAME="PlacementGuide"

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("MongoDB not connected", error);
        process.exit(1);
    }
};

module.exports = connectDB;
