import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  foodQuality: { type: Boolean },
  deliveryTime: { type: Boolean },
  packaging: { type: Boolean },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;