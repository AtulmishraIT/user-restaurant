import express, { json, urlencoded } from "express";
import Dine from "./backend/dine.js";
import collection from "./backend/mongo.js";
import Food from "./backend/foodM.js";
import Order from "./backend/order.js";
import cors from "cors";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import twilio from 'twilio';

dotenv.config();
const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get("/", cors(), (req, res) => {});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const data = {
    email: email,
    password: password,
  };
  try {
    const check = await collection.findOne({ email: data.email });
    if (check) {
      const isMatch = await bcrypt.compare(password, check.password);
      if (isMatch) {
        return res.json("exist");
      } else {
        return res.json("Password not match");
      }
    } else {
      res.json("notexist");
    }
  } catch (e) {
    res.json("fail");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, name, mobno, cpassword, isLogin } = req.body;

  const data = {
    email: email,
    password: password,
    name: name,
    mobno: mobno,
    cpassword: cpassword,
    isLogin: isLogin,
  };

  try {
    if (password != cpassword) {
      res.json("Password not matched*");
    }
    const check = await collection.findOne({ email: email });
    if (check) {
      res.json("exist");
    } else {
      res.json("notexist");
      data.password = await bcrypt.hash(password, 10);
      data.cpassword = await bcrypt.hash(cpassword, 10);
      await collection.insertMany([data]);
    }
  } catch (e) {
    res.json("fail");
    res.status(400).json({ message: "Failed" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});
// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found*");
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expirationDate = Date.now() + 180000; // Token valid for 1 hour

    user.resetToken = token;
    user.resetTokenExpiration = expirationDate;
    await user.save();

    // Send email with reset link
    const resetLink = `http://localhost:5173/resetpassword/${token}`;
    await transporter.sendMail({
      from: "matul6332@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `<p className="text-2xl">You requested a password reset. Link is expired in ${user.resetTokenExpiration.toLocaleString()}. Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
    });

    res.json("Reset link sent to your email");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json("Error sending reset link");
  }
});

// Reset Password Route
app.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password, cpassword } = req.body;

  try {
    const user = await collection.findOne({ resetToken: token });

    if (!user || user.resetTokenExpiration < Date.now()) {
      return res.status(400).json("Invalid or expired token");
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.cpassword = await bcrypt.hash(cpassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined; // Clear the reset token
    user.resetTokenExpiration = undefined; // Clear the expiration date
    await user.save();

    res.json("Password has been reset successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while resetting the password");
  }
});

// Backend Route to Fetch User Data
app.get("/user/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json("User  not found");
    }
    // Exclude sensitive data like password
    const userData = {
      name: user.name,
      email: user.email,
      mobno: user.mobno,
      isLogin: user.isLogin,
    };
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching user data");
  }
});

app.get("/home/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json("User  not found");
    }
    // Exclude sensitive data like password
    const userData = {
      name: user.name,
      email: user.email,
      mobno: user.mobno,
      isLogin: user.isLogin,
    };
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json("Error fetching user data");
  }
});

app.post("/logout", (req, res) => {
  // Clear the session or token (depending on your authentication method)
  res.clearCookie("token"); // Example: Clear a cookie-based token
  res.status(200).json({ message: "Logged out successfully" });
});
let otpStore = {}; // Store OTPs temporarily
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
  
  // Store OTP with email as key
  otpStore[email] = otp;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'OTP for changing mobile or email',
    text: `Your OTP code is ${otp}, expires when you use it for one time`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { email, otp, newMobNo, newEmail } = req.body;
  
  if (otpStore[email] === parseInt(otp)) {
    // OTP is correct, update mobile number or email
    const user = await collection.findOne({email});
  if(!user){
    return console.log("user not found");
  }
    try {
      if (newMobNo) {
        // Update mobile number
        user.mobno = newMobNo;
      }
      if (newEmail) {
        // Update email
        user.email = newEmail;
      }
      console.log(user.mobno,newMobNo,newEmail)
      await user.save();
      delete otpStore[email]; // Remove OTP from store
      res.status(200).json({ message: 'Mobile number or email updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating mobile number or email', error });
    }
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});


app.post('/addfooddata', async (req, res) => {
  try {
      const foodItems = req.body.foodData;
      const savedFoodItems = await Food.insertMany(foodItems);
      res.status(200).json({ message: 'Food items saved successfully', data: savedFoodItems });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving food items' });
  }
});

app.post("/cart/save-address", async (req, res) => {
  const { email, address } = req.body;
  try {
    const user = await collection.findOne({ email });
    if (user) {
      user?.address?.push(address);
      await user?.save();
      res.json({ message: "Address saved successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/cart/save", async (req, res) => {
  try {
    const { cartItems, email } = req.body;

    // Validate request data
    if (!email || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find the user by email
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let hasNewItems = false; // Track if new items are added to the cart

    // Iterate through the cartItems and add them to the user's cart if they don't already exist
    for (const item of cartItems) {
      const itemExists = user.cartitems.some(
        (cartItem) => cartItem.foodId === item.foodId
      );

      if (!itemExists) {
        user.cartitems.push(item); // Add the new item to the cart
        hasNewItems = true; // Mark that new items were added
      }
    }

    // If no new items were added, return a message indicating no changes
    if (!hasNewItems) {
      return res.status(200).json({ message: "No new items added to the cart" });
    }

    // Save the updated user document
    await user.save();

    // Return success response
    res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data", error: error.message });
  }
});

app.get("/getCartItems", async (req, res) => {
  const email = req.body;
  try {
    const user = await collection.findOne(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const orderData = user.cartitems;
    res.json(orderData);
    await user.save();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/cart/ordered", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if ordered array exists, if not initialize it
    if (!Array.isArray(user.ordered)) {
      user.ordered = [];
    }

    // Add only unique items from cartitems to ordered
    const cartItemsSet = new Set(user.cartitems.map(item => item.foodId));
    const orderedItemsSet = new Set(user.ordered.map(item => item.foodId));

    const newItems = user.cartitems.filter(item => !orderedItemsSet.has(item.foodId));
    user.ordered = [...user.ordered, ...newItems];
    
    await user.save();
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/cart/address", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure addresses is an array, if it's undefined or null, return an empty array
    const addresses = Array.isArray(user?.address) ? user.address : [];
    res.status(200).json({ address: addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/cart/DeleteAdd", async (req, res) => {
  const { email, address } = req.body;
  try {
    const user = await collection.findOne({ email });
    if (user) {
      await collection.updateOne(
        { email },
        { $pull: { address: address } }
      );
      res.json({ message: "Address deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/fav", async (req, res) => {
  const { email, foodId } = req.body;
  try {
    const user = await collection.findOne({ email });
    if (user) {
      if (!user.favourite.some(fav => fav.id === foodId.id)) {
        user.favourite = [...user.favourite, foodId]; // Add foodId to the array if not already present
        await user.save();
        res.json({ message: "Favourite saved successfully" });
      } else {
        res.json({ message: "Food item is already in favourites" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/getFav", async (req,res) => {
  const {email} = req.body;
  try{
    const user = await collection.findOne(email);
    if(!user){
      res.status(404).json({ message: "User not found" });
    }
    res.json(user.favourite);
  }catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/deleteFav", async (req, res) => {
  const { email, foodId } = req.body;

  // Ensure foodId is provided
  if (!foodId) {
    return res.status(400).json({ message: "Invalid food item data" });
  }

  try {
    // Find the user by email
    const user = await collection.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use $pull to remove the foodItem with the specified foodId from the 'favourite' array
    const updatedUser = await collection.updateOne(
      { email },
      { $pull: { favourite: { id: foodId } } } // Pull only the item with matching foodId
    );

    // Check if the update was successful
    if (updatedUser.modifiedCount > 0) {
      // Return updated user information (optional, can just return success message if preferred)
      const userWithUpdatedFavs = await collection.findOne({ email });
      return res.status(200).json({
        message: "Food item removed from favourites",
        favourite: userWithUpdatedFavs.favourite // Optionally return the updated favourites list
      });
    } else {
      return res.status(404).json({ message: "Food item not found in favourites" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/Dine/chairs", async (req, res) => {
  try {
    // Fetch chairs from the Dine collection
    const dineData = await Dine.find();
    if (!dineData) {
      return res.status(404).json({ message: "No chairs data found" });
    }
    // Get chair details and return
    const chairs = dineData[0]?.chairId || [];
    res.json(chairs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Set Chair Status (Occupied/Available) in Dine collection
app.patch("/Dine/chairs/:id", async (req, res) => {
  const { id } = req.params; // Chair id to update
  const { occupied, email, userName, userPhone, time } = req.body;

  try {
    // Find the Dine data and update the chair's status
    const dineData = await Dine.findOne();
    if (!dineData) {
      return res.status(404).json({ message: "Dine data not found" });
    }
    const chair = dineData.chairId.find(chair => chair.chairs === parseInt(id));
    if (!chair) {
      return res.status(404).json({ message: "Chair not found" });
    }
    chair.userEmail = email;
    chair.occupied = occupied; // Update chair status
    chair.userName = userName;
    chair.userPhone = userPhone;
    chair.time = time;
    await dineData.save();
    res.json({ message: "Chair status updated successfully", chair });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save chair data for Dine-in
app.post("/Dine/setChairs", async (req, res) => {
  const { email, chairs } = req.body; // List of chairs to save
  try {
    // Add or update chair information in the Dine collection
    const dineData = await Dine.findOne();
    if (dineData) {
      dineData.chairId = chairs; // Update chair data
      await dineData.save();
    } else {
      const newDineData = new Dine({ chairId: chairs });
      await newDineData.save(); // Create new Dine entry with chairs
    }
    await dineData.save();
    res.json({ message: "Chairs saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/order", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.ordered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/savepayment", async (req, res) => {
  const { email, payment } = req.body;
  try {
    const user = await collection.findOne({ email });
    if (user) {
      // If user has payment data, append the new payment method.
      if (user.payment) {
        // Check if UPI field is empty or undefined
        if (!user.payment.upi && payment.upi) {
          user.payment.upi = payment.upi;
        } else if (!user.payment.creditCard && payment.creditCard) {
          user.payment.creditCard = payment.creditCard;
        } else if (!user.payment.debitCard && payment.debitCard) {
          user.payment.debitCard = payment.debitCard;
        }
        user.markModified("payment");
        await user.save();
      } else {
        // If no payment data exists, create it
        user.payment = payment;
        user.markModified("payment");
        await user.save();
      }

      await user.save(); // Save the updated user document
      res.json(user.payment); // Send back the updated payment info
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getpayment",async(req,res)=> {
  const {email} = req.query;
  try{
    const user = await collection.findOne({email});
    res.json(user.payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

app.post("/deletepayment", async (req, res) => {
  const { email, method } = req.body;
  try {
    const user = await collection.findOne({ email });
    if (user) {
      if (method === 'upi') {
        user.payment.upi = null;
      } else if (method === 'creditCard') {
        user.payment.creditCard = null;
      } else if (method === 'debitCard') {
        user.payment.debitCard = null;
      }
      await user.save();
      res.json({ message: "Payment method deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getFoodData", async(req,res) => {
  try {
    const foodData = await Food.find();
    res.json({ foodItems: foodData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
app.post("/orders", async (req, res) => {
  const { id, date, total, items, phase } = req.body;
  try {
    const newOrder = new Order({
      id,
      date,
      total,
      items,
      phase,
    });
    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get("/getOrders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/deleteCartItems", async(req,res) => {
  const {email} = req.body;
  try {
    const user = await collection.findOne({email}); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.cartitems = [];
    await user.save();
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
