import { connect, Schema, model } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
//connect("mongodb+srv://atulmishra7:Xn0iG8RBUW9pnZ4S@cluster0.g40ox.mongodb.net/login") //for connection to the database
const MONGO_URL1 = process.env.MONGO_URL;
connect(MONGO_URL1)
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("failed");
  });

const newSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobno: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    default: null,
  },
  isLogin: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
    default: null, 
  },
  resetTokenExpiration: {
    type: Date,
    default: null, 
  },
  cartitems: [
    {
      foodId: String,
      name: String,
      image: String,
      quantity: Number,
      price: Number,
    },
  ],
  address: {
    type: Array,
  },
  favourite:{
    type: Array,
  },
  ordered: {
    type: Array,
  },
  payment: {
    upi: { type: String, default: null },
    creditCard: { type: String, default: null },
    debitCard: { type: String, default: null },
  },
});

const collection = model("collection", newSchema);
export default collection;