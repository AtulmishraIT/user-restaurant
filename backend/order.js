import { connect, Schema, model } from "mongoose";
import dotenv from "dotenv";
import { type } from "os";
dotenv.config();
const MONGO_URL1 = process.env.MONGO_URL;
connect(MONGO_URL1)
  .then(() => {
    console.log("mongodb connected order");
  })
  .catch(() => {
    console.log("failed");
  });

const orderSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  phase:{
    type: String,
    required: true,
  }
});

const Order = model('Order', orderSchema);

export default Order;