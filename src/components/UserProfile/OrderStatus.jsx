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

// Custom icons for markers
const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/8090/8090408.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1946/1946488.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
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
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
        const response = await axios.get("http://localhost:8000/getCartItems", {
          email,
        });
        console.log("foodData***", response.data);
        setFoodData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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
        setLoading(true);
        const response = await axios.get("http://localhost:8000/getOrders");
        const order = response.data.orders.find(
          (order) => order.id === parseInt(orderId)
        );
        setOrder(order);
        console.log("Savedorder",order);
        if (order) {
          setOrderPhase(order.phase);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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
        // Fallback to a simple calculation if API fails
        setDuration(Math.floor(Math.random() * 20) + 10); // Random time between 10-30 minutes
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
      year: "numeric",
    });
  };

  // Get the appropriate icon for the current order phase
  const getPhaseIcon = (phase) => {
    switch(phase) {
      case "received":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-500">
            <path d="M5 8h14"></path>
            <path d="M5 12h14"></path>
            <path d="M5 16h14"></path>
            <path d="M3 21h18"></path>
            <path d="M3 3h18"></path>
          </svg>
        );
      case "processing":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-yellow-500">
            <path d="M12 2v4"></path>
            <path d="M12 18v4"></path>
            <path d="m4.93 4.93 2.83 2.83"></path>
            <path d="m16.24 16.24 2.83 2.83"></path>
            <path d="M2 12h4"></path>
            <path d="M18 12h4"></path>
            <path d="m4.93 19.07 2.83-2.83"></path>
            <path d="m16.24 7.76 2.83-2.83"></path>
          </svg>
        );
      case "cooking":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-orange-500">
            <path d="M8 3v3"></path>
            <path d="M16 3v3"></path>
            <path d="M8 14h8"></path>
            <path d="M8 18h8"></path>
            <path d="M3 22h18"></path>
            <path d="M3 10h18V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3z"></path>
          </svg>
        );
      case "out for delivery":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-500">
            <path d="M10 17h4V5H2v12h3"></path>
            <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path>
            <path d="M14 17h1"></path>
            <circle cx="7.5" cy="17.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
          </svg>
        );
      case "delivered":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-500">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-500">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        );
    }
  };

  // Get color for the current phase
  const getPhaseColor = (phase) => {
    switch(phase) {
      case "received": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      case "cooking": return "bg-orange-500";
      case "out for delivery": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isDelivered ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center"
        >
          <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mx-auto mb-6">
            <svg
              className="w-16 h-16 text-green-500"
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Delivered!</h2>
          <p className="text-gray-600 mb-6">Your food has been delivered successfully. Enjoy your meal!</p>
          
          {order && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Order #{order.id}</p>
              <p className="text-sm text-gray-500 mb-1">Date: {order.date ? formatDate(order.date) : "..."}</p>
              <p className="text-sm text-gray-500 mb-1">Time: {order.date ? formatTime(order.date) : "..."}</p>
              <p className="text-sm text-gray-500">Total: ₹{order.total}</p>
            </div>
          )}
          
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Return to Home
          </Link>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="mt-2 text-gray-600">Track your order in real-time</p>
          </div>
          
          {/* Order Progress Bar */}
          <div className="mb-10 px-4">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${getPhaseColor(orderPhase)}`} 
                  style={{ 
                    width: `${(orderPhases.indexOf(orderPhase) + 1) * 100 / orderPhases.length}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between">
                {orderPhases.map((phase, index) => (
                  <div 
                    key={phase} 
                    className={`flex flex-col items-center ${
                      orderPhases.indexOf(orderPhase) >= index 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`}
                  >
                    <div 
                      className={`rounded-full transition-all duration-500 flex items-center justify-center w-10 h-10 ${
                        orderPhases.indexOf(orderPhase) >= index 
                          ? getPhaseColor(phase) 
                          : 'bg-gray-200'
                      }`}
                    >
                      {orderPhases.indexOf(orderPhase) > index ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : orderPhases.indexOf(orderPhase) === index ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-xs font-medium mt-2 hidden sm:block capitalize">
                      {phase}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Order Details Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPhaseColor(orderPhase)} text-white`}>
                    {orderPhase}
                  </div>
                </div>
                
                {order && (
                  <>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">Order ID</div>
                      <div className="font-medium">#{order.id}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">Date & Time</div>
                      <div className="font-medium">
                        {order.date ? (
                          <>
                            {formatDate(order.date)} <br />
                            <span className="text-sm text-gray-500">{formatTime(order.date)}</span>
                          </>
                        ) : "..."}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">Items</div>
                      <div className="font-medium">{order.items ? order.items.length : 0}</div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-lg font-bold">₹{order.total}</div>
                    </div>
                    
                    {/* Current Status */}
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      {getPhaseIcon(orderPhase)}
                      <div className="ml-3">
                        <div className="font-medium">Status: <span className="capitalize">{orderPhase}</span></div>
                        <div className="text-sm text-gray-500">
                          {orderPhase === "received" && "We've received your order!"}
                          {orderPhase === "processing" && "Your order is being processed."}
                          {orderPhase === "cooking" && "Your food is being prepared."}
                          {orderPhase === "out for delivery" && "Your food is on the way!"}
                          {orderPhase === "delivered" && "Your order has been delivered."}
                        </div>
                      </div>
                    </div>
                    
                    {/* Estimated Delivery */}
                    {orderPhase === "out for delivery" && (
                      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <div className="ml-3">
                            <div className="font-medium text-blue-800">Estimated Delivery</div>
                            <div className="text-sm text-blue-600">
                              {duration ? `${Math.ceil(duration)} minutes` : "Calculating..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Map Card */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-[500px] relative">
                <MapContainer
                  center={currentPosition}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={currentPosition} icon={restaurantIcon}>
                    <Popup>Restaurant Location</Popup>
                  </Marker>
                  <Marker position={userAddress} icon={homeIcon}>
                    <Popup>Delivery Address</Popup>
                  </Marker>
                  <Polyline
                    positions={[currentPosition, userAddress]}
                    color="#4F46E5"
                    weight={4}
                    opacity={0.7}
                    dashArray={orderPhase === "out for delivery" ? "" : "10, 10"}
                  />
                </MapContainer>
                
                {/* Map Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div>
                      <div className="text-sm opacity-80">Estimated Delivery Time</div>
                      <div className="text-xl font-bold">
                        {duration ? `${Math.ceil(duration)} minutes` : "Calculating..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          {order && order.items && order.items.length > 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, index) => (
                    <div key={index} className="py-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                          {item.quantity}x
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">₹{item.price} each</div>
                        </div>
                      </div>
                      <div className="font-bold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                  <div className="font-medium">Total</div>
                  <div className="text-xl font-bold">₹{order.total}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderStatus;