import { connect, Schema, model } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL1 = process.env.MONGO_URL;
connect(MONGO_URL1)
  .then(() => {
    console.log("mongodb connected 2");
  })
  .catch(() => {
    console.log("failed");
  });

const foodSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 200
  }
});

const Food = model('Food', foodSchema);

export default Food;
