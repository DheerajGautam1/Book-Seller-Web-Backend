import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "book-seller-market"
    }).then(() => {
        console.log("Connected to Database");
    }).catch((error) => {
        console.log(`Some Error to connect Database: ${error}`);
    })
}

export default connectDB;