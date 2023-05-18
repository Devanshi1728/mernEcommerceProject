const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`connected to mongoDb on ${mongoose.connection.host}`);
  } catch (error) {
    console.log(`MongoDB error ${error}`);
  }
};

module.exports = connectDB;
