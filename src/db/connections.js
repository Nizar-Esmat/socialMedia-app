import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    console.log(`db connected with ${db.connection.host}`);
    return db;
  } catch (error) {
    return console.log(error.message);
  }
};

export default dbConnect;