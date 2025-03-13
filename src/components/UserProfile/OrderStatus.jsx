// filepath: /c:/Users/atulm/OneDrive/Desktop/website/restaurant/src/components/UserProfile/OrderStatus.jsx
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Fix for default icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function OrderStatus() {
  const [orderPhase, setOrderPhase] = useState("received");
  const [location, setLocation] = useState("Restaurant");
  const [currentPosition, setCurrentPosition] = useState([19.2173692, 73.15]); // Default position
  const [userAddress, setUserAddress] = useState([19.2173692, 73.1659614]); // Default user address
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [foodData, setFoodData] = useState([]);
  const [isDelivered, setIsDelivered] = useState(false);
  const [order, setOrder] = useState({});
  const email = localStorage.getItem("userEmail");
  const orderPhases = [
    "received",
    "processing",
    "cooking",
    "out for delivery",
    "delivered",
  ];
  const isOrderAdded = localStorage.getItem("orderAdded");

  useEffect(() => {
    const GetFoodData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getCartItems", {
          email,
        });
        console.log("foodData***", response.data);
        setFoodData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetFoodData();
  }, []);

  useEffect(() => {
    // Get current location
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentPosition([position.coords.latitude, position.coords.longitude]);
    });

    // Fetch user address from database and convert to latitude and longitude
    const fetchUserAddress = async () => {
      const email = localStorage.getItem("userEmail");
      try {
        const response = await axios.get("http://localhost:8000/cart/address", {
          params: { email },
        });
        console.log("API Response:", response.data); // Log the response data
        const address = response.data.address || "Mumbai, India";
        //const geocodeResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=34c19b7fb7cc47249593f2b9f04759ec`);
        //const { lat, lng } = geocodeResponse.data.results[0].geometry;

        //console.log('User Address:', address, lat, lng); // Log the user address
      } catch (error) {
        console.error("Error fetching user address:", error);
      }
    };
    fetchUserAddress();
  }, []);

  // reload page after 5 seconds every time
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if(!localStorage.getItem("userOrderAdded")){
    const addOrderedItems = async () => {
      const email = localStorage.getItem("userEmail");
      try {
        const response = await axios.post(
          "http://localhost:8000/cart/ordered",
          { email }
        );
        localStorage.setItem("userOrderAdded",true);
        return response.data;
      } catch (error) {
        console.error("Error adding ordered items:", error);
      }
    };
    addOrderedItems();
  }
    if(foodData.length > 0){
    if (!localStorage.getItem("orderAdded")) {
      // Send order details to the database
      localStorage.setItem("orderAdded", "true");
      const sendOrderToDatabase = async () => {
        const orderDetails = {
          id: Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1,
          date: new Date(),
          total: foodData.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          ), // Calculate total
          items: foodData.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })), // Map items
          phase: "received",
        };
        console.log("orderID*****", orderDetails.items);
        localStorage.setItem("orderId", orderDetails.id);
        try {
          const response = await axios.post("http://localhost:8000/orders", 
            orderDetails
          );
          console.log("Order sent to database:", response.data);
        } catch (error) {
          console.error("Error sending order to database:", error);
        }
      };
      sendOrderToDatabase();
    }
  }
  }, [foodData]);

  useEffect(() => {
    const handleOrders = async () => {
      const orderId = localStorage.getItem("orderId");
      try {
        const response = await axios.get("http://localhost:8000/getOrders");
        const order = response.data.orders.find(
          (order) => order.id === parseInt(orderId)
        );
        setOrder(order);
        console.log("Savedorder",order);
        if (order) {
          setOrderPhase(order.phase);
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleOrders();
  }, []);

  useEffect(() => {
    if (orderPhase === "delivered") {
      setIsDelivered(true);
      localStorage.removeItem("orderAdded");
      localStorage.removeItem("userOrderAdded");
      //remove all order id from local storage stored with number in key like 122,123,124
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.match(/^[0-9]+$/)) {
          localStorage.removeItem(key);
        }
      } 
      const deleteCartItems = async () => {
      try {
        const response = await axios.post("http://localhost:8000/deleteCartItems",{email});
        if (response.status === 200) {
          console.log("Cart items deleted", response.data);
        } else {
          console.log("Failed to delete cart items", response.data);
        }
        

      } catch (error) {
       console.log("Error in deleting",error) 
      }
    }
    deleteCartItems();
    }
  }, [orderPhase]);

  useEffect(() => {
    // Calculate distance and duration between current position and user address using Mapbox
    const calculateRoute = async () => {
      const accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${currentPosition[1]},${currentPosition[0]};${userAddress[1]},${userAddress[0]}?access_token=${accessToken}`;

      try {
        const response = await axios.get(url);
        const route = response.data.routes[0];
        const distanceInKm = route.distance / 1000; // Convert to kilometers
        const durationInMinutes = route.duration / 60; // Convert to minutes

        setDistance(distanceInKm);
        setDuration(durationInMinutes);
      } catch (error) {
        console.error("Error calculating route:", error);
      }
    };

    calculateRoute();
  }, [currentPosition, userAddress]);

  // Function to format the date and extract the time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (dateS) => {
    const date = new Date(dateS);
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "4-digit",
    });
  };

  return (
    <div className="flex flex-col max-lg:mx-auto max-lg:my-auto max-lg:mt-7 max-lg:-mr-8 lg:flex-row items-center justify-center min-h-screen inset-80 ">
      {isDelivered ? (
        <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center"
      >
        <div className="flex items-center justify-center w-32 h-32 bg-green-500 rounded-full">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <p className="mt-4 text-2xl font-bold text-green-500">Your order is delivered</p>
        <Link to="/" className="mt-2 text-blue-500 underline">
          Go to Home Page
        </Link>
      </motion.div>
      ) : (
        <div className="w-full flex max-lg:flex-col max-sm:mx-auto justify-center">
          <div className="lg:w-full w-full h-full py-6">
            <MapContainer
              center={currentPosition}
              zoom={15}
              scrollWheelZoom={false}
              className="max-w-full max-lg:w-full h-[500px] shadow-[100px 100px 100px 100px] shadow-inner shadow-black/25 "
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={currentPosition}>
                <Popup>Current Location</Popup>
              </Marker>
              <Marker position={userAddress}>
                <Popup>Delivery Address</Popup>
              </Marker>
              <Polyline
                positions={[currentPosition, userAddress]}
                color="blue"
              />
            </MapContainer>
            <div className="text-xl font-semibold">
              Estimated Delivery Time: {duration ? duration.toFixed(2) : "..."}{" "}
              minutes
            </div>
          </div>
          <div className="lg:w-1/2 w-full h-full mt-6 px-10 py-10 bg-gray-200 max-lg:-mt-20 max-lg:shadow-2xl">
            <div className="-ml-5 border-gray-500 flex flex-col justify-center gap-5">
              <div className="px-3 py-4 text-lg bg-white">
                <p className="text-sm">Order: #{order ? order.id : 0}</p>
                <div className="flex flex-col justify-start items-start text-sm mt-2">
                  <p>Date: {order ? order.date : 0}</p>
                  {order ? (
                    <p className="flex justify-center items-center gap-1">
                      <span>{order.date ? formatTime(order.date) : "..."}</span>{" "}
                      |{" "}
                      <span>{order.items ? order.items.length : 0} items</span>{" "}
                      |{" "}
                      <span className="flex justify-center items-center">
                        <box-icon name="rupee" size="16px"></box-icon>
                        {order.total}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="">
                <p className="px-3 py-4 text-lg bg-white flex justify-start items-center">
                  <svg
                    className="w-[48px] h-[48px] text-gray-800"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="0.9"
                      d="M9 8h6m-6 4h6m-6 4h6M6 3v18l2-2 2 2 2-2 2 2 2-2 2 2V3l-2 2-2-2-2 2-2-2-2 2-2-2Z"
                    />
                  </svg>

                  {orderPhase.toLocaleUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStatus;