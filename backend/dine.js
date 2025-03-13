import { connect, Schema, model } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL1 = process.env.MONGO_URL;
connect(MONGO_URL1)
  .then(() => {
    console.log("mongodb connected 1");
  })
  .catch(() => {
    console.log("failed");
  });


const newSchema = new Schema({
  chairId: [
    {
      chairs: Number,
      occupied: Boolean,
      userEmail: String,
      userName: String,
      userPhone: String,
      time: String,
    },
  ],
});

const Dine = model("Dine", newSchema);
export default Dine;