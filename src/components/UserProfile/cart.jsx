import React, { useEffect, useState } from "react";
import foodData from "../../food/food1.json";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../Loading";
import axios from "axios";
import { 
  FiShoppingCart, 
  FiMapPin, 
  FiPlus, 
  FiMinus, 
  FiCheck, 
  FiX, 
  FiHome, 
  FiDollarSign, 
  FiCreditCard, 
  FiTruck, 
  FiGift, 
  FiHeart
} from "react-icons/fi";
import { 
  RiMapPinLine, 
  RiMapPinFill, 
  RiRestaurantLine, 
  RiMoneyDollarCircleLine, 
  RiArrowLeftSLine, 
  RiArrowRightSLine 
} from "react-icons/ri";
import { BiRupee } from "react-icons/bi";

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Cart() {
  const [data1, setData1] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [addnew, setAddnew] = useState(false);
  const [foodData1, setFoodData1] = useState([]);
  const [floor, setFloor] = useState("");
  const [landmark, setLandmark] = useState("");
  const [place, setPlace] = useState("");
  const [position, setPosition] = useState([51.505, -0.09]);
  const [saveadd, setSaveadd] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [tipOptions] = useState([10, 20, 50, 100]);
  const [selectedTip, setSelectedTip] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  // Calculate totals
  const itemsTotal = data1.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 50;
  const extraDiscount = 20;
  const gstCharges = (itemsTotal + deliveryFee - extraDiscount) * 0.12;
  const totalAmount = itemsTotal + deliveryFee - extraDiscount + gstCharges + deliveryTip;

  useEffect(() => {
    const GetFoodData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getFoodData");
        setFoodData1(
          Array.isArray(response.data.foodItems) ? response.data.foodItems : []
        );
      } catch (error) {
        console.log(error);
      }
    };
    GetFoodData();
  }, []);

  useEffect(() => {
    const cartData = () => {
      const data = foodData.foodItems
        .map((food) => {
          const item = localStorage.getItem(food.id);
          return item ? JSON.parse(item) : null;
        })
        .filter((item) => item !== null);
      setData1(data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      setCartCount(data.reduce((total, item) => total + item.quantity, 0));
      localStorage.removeItem("orderAdded");
      localStorage.removeItem("userOrderAdded");
      localStorage.removeItem("orderId");
    };
    cartData();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        // Reverse geocoding
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            setAddress(data.display_name || "");
          });
      });
    }

    // Check login status
    const email = localStorage.getItem("userEmail");
    setIsLogin(!!email);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;
      
      try {
        const response = await axios.get("http://localhost:8000/cart/address", {
          params: { email },
        });
        setSaveadd(response.data.address || []);
      } catch (err) {
        console.error(
          "Error fetching addresses:",
          err.response ? err.response.data : err.message
        );
        setSaveadd([]);
      }
    };

    fetchAddresses();
  }, []);

  const updateQuantity = (foodId, quantity) => {
    const updatedData = data1
      .map((item) => {
        if (item.id === foodId) {
          const updatedItem = { ...item, quantity: item.quantity + quantity };
          if (updatedItem.quantity > 0) {
            localStorage.setItem(foodId, JSON.stringify(updatedItem));
            return updatedItem;
          } else {
            localStorage.removeItem(foodId);
            return null;
          }
        }
        return item;
      })
      .filter((item) => item !== null);
    
    setData1(updatedData);
    setCartCount(updatedData.reduce((total, item) => total + item.quantity, 0));
  };

  const handlesendaddress = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      await axios.post("http://localhost:8000/cart/save", {
        cartItems: data1.map((item) => ({
          foodId: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        email: email,
      });
      
      // Show success toast or notification here
    } catch (err) {
      console.error(
        "Error saving data:",
        err.response ? err.response.data : err.message
      );
      // Show error toast or notification here
    }
  };

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
        
        // Reverse geocoding
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        )
          .then((response) => response.json())
          .then((data) => {
            setAddress(data.display_name);
          });
      },
    });

    const handleMarkerDragEnd = (e) => {
      const newPosition = e.target.getLatLng();
      setPosition([newPosition.lat, newPosition.lng]);
      
      // Reverse geocoding
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`
      )
        .then((response) => response.json())
        .then((data) => {
          setAddress(data.display_name);
        });
    };

    return position === null ? null : (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{ dragend: handleMarkerDragEnd }}
      />
    );
  }

  const handlePayment = () => {
    handlesendaddress();
    // Redirect to payment gateway
    window.location.href = "/payment-gateway";
  };

  const handleCloseModal = (e) => {
    if (e.target.id === "modal-overlay") {
      setAddnew(false);
    }
  };

  const handleNewAddress = async () => {
    setIsAddressLoading(true);
    const newAddress = `${place}, ${floor}, ${landmark}, ${address}`;
    const email = localStorage.getItem("userEmail");
    
    try {
      await axios.post(
        "http://localhost:8000/cart/save-address",
        {
          email,
          address: newAddress,
        }
      );
      
      setSaveadd((prevSaveadd) => {
        return [...(prevSaveadd || []), newAddress];
      });
      
      setAddnew(false);
      // Show success notification
    } catch (err) {
      console.error(
        "Error saving address:",
        err.response ? err.response.data : err.message
      );
      // Show error notification
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleAddTip = (amount) => {
    setDeliveryTip(amount);
    setSelectedTip(amount);
  };

  const handleCustomTip = () => {
    const tip = prompt("Enter tip amount: ");
    if (tip && !isNaN(tip)) {
      const tipAmount = parseFloat(tip);
      setDeliveryTip(tipAmount);
      setSelectedTip(tipAmount);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FiShoppingCart className="mr-3" /> 
            Your Cart
            {cartCount > 0 && (
              <span className="ml-3 text-sm bg-orange-500 text-white px-2 py-1 rounded-full">
                {cartCount} items
              </span>
            )}
          </h1>
        </div>

        {cartCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center"
          >
            <img
              src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0"
              className="h-64 w-64 mb-6"
              alt="Empty Cart"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">You can go to home page to view more food options</p>
            <Link 
              to="/home" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center"
            >
              <RiArrowLeftSLine className="mr-2" /> Browse Menu
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items & Address */}
            <div className="flex-1">
              {/* Cart Items Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <RiRestaurantLine className="mr-2 text-orange-500" size={22} />
                    Order Summary
                  </h2>
                  <span className="text-sm text-gray-500">{cartCount} items</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {data1.map((foodItem) => (
                    <motion.div
                      key={foodItem.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {foodItem.image ? (
                            <img 
                              src={foodItem.image || "/placeholder.svg"} 
                              alt={foodItem.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <RiRestaurantLine size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{foodItem.name}</h3>
                          <p className="text-gray-500 text-sm flex items-center">
                            <BiRupee className="inline" /> {foodItem.price} each
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            className="px-3 py-1 text-gray-500 hover:text-red-500 transition-colors"
                            onClick={() => updateQuantity(foodItem.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={16} />
                          </button>
                          <span className="px-3 py-1 font-medium text-gray-800">
                            {foodItem.quantity}
                          </span>
                          <button
                            className="px-3 py-1 text-gray-500 hover:text-green-500 transition-colors"
                            onClick={() => updateQuantity(foodItem.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-gray-800 flex items-center">
                            <BiRupee className="inline" /> {foodItem.price * foodItem.quantity}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Address Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6 mb-6"
              >
                {selectedAddress ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FiMapPin className="mr-2 text-orange-500" size={22} />
                        Delivery Address
                      </h2>
                      <button
                        className="text-orange-500 hover:text-orange-600 font-medium text-sm flex items-center"
                        onClick={() => setSelectedAddress("")}
                      >
                        Change <RiArrowRightSLine className="ml-1" />
                      </button>
                    </div>
                    
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                      <div className="bg-green-100 rounded-full p-2 mr-3 text-green-600 flex-shrink-0">
                        <FiCheck size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">
                          {selectedAddress.split(',')[0]}
                        </h3>
                        <p className="text-gray-600 text-sm">{selectedAddress}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <FiMapPin className="mr-2 text-orange-500" size={22} />
                      Choose a delivery address
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {saveadd.map((addr, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedAddress === addr ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                          }`}
                          onClick={() => handleSelectAddress(addr)}
                        >
                          <div className="flex items-start">
                            <div className="mr-3 text-gray-500">
                              <RiMapPinFill size={20} className="text-orange-500" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-800 mb-1">
                                {addr.split(',')[0]}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{addr}</p>
                              <button
                                className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition-colors duration-200"
                              >
                                Deliver here
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: saveadd.length * 0.05 }}
                        className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setAddnew(true)}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-500">
                          <FiPlus size={24} />
                        </div>
                        <h3 className="font-medium text-gray-800 mb-1">Add New Address</h3>
                        <p className="text-gray-500 text-sm">Add a new delivery location</p>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Payment Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`bg-white rounded-lg shadow-sm p-6 ${!selectedAddress ? 'opacity-70' : ''}`}
              >
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <FiCreditCard className="mr-2 text-orange-500" size={22} />
                  Payment Method
                </h2>
                
                <button
                  className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                    !selectedAddress ? 'cursor-not-allowed opacity-70' : ''
                  }`}
                  onClick={handlePayment}
                  disabled={!selectedAddress}
                >
                  <FiCreditCard className="mr-2" />
                  Proceed to Payment
                </button>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-96">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-6 sticky top-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center">
                  <RiMoneyDollarCircleLine className="mr-2 text-orange-500" size={22} />
                  Bill Details
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Item Total</span>
                    <span className="font-medium text-gray-800 flex items-center">
                      <BiRupee className="inline" /> {itemsTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-gray-800 flex items-center">
                      <BiRupee className="inline" /> {deliveryFee.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600 flex items-center">
                      - <BiRupee className="inline" /> {extraDiscount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST and Restaurant Charges</span>
                    <span className="font-medium text-gray-800 flex items-center">
                      <BiRupee className="inline" /> {gstCharges.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-600 flex items-center">
                        <FiHeart className="mr-1 text-red-500" /> Delivery Partner Tip
                      </span>
                      {deliveryTip > 0 ? (
                        <span className="font-medium text-gray-800 flex items-center">
                          <BiRupee className="inline" /> {deliveryTip.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-orange-500 font-medium">Add Tip</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mb-4">
                      {tipOptions.map((tip) => (
                        <button
                          key={tip}
                          className={`flex-1 py-2 px-1 text-sm rounded border transition-colors ${
                            selectedTip === tip
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'border-gray-200 text-gray-700 hover:border-orange-300'
                          }`}
                          onClick={() => handleAddTip(tip)}
                        >
                          ₹{tip}
                        </button>
                      ))}
                      <button
                        className={`flex-1 py-2 px-1 text-sm rounded border transition-colors ${
                          selectedTip && !tipOptions.includes(selectedTip)
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'border-gray-200 text-gray-700 hover:border-orange-300'
                        }`}
                        onClick={handleCustomTip}
                      >
                        Custom
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">To Pay</span>
                      <span className="font-bold text-lg text-gray-900 flex items-center">
                        <BiRupee className="inline" /> {totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {extraDiscount > 0 && (
                    <div className="mt-4 bg-green-50 p-3 rounded-lg text-sm text-green-800 flex items-start">
                      <FiGift className="mr-2 flex-shrink-0 mt-0.5" />
                      <span>You're saving ₹{extraDiscount.toFixed(2)} on this order!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Address Modal */}
      <AnimatePresence>
        {addnew && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="modal-overlay"
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <RiMapPinLine className="mr-2 text-orange-500" size={22} />
                  Add New Delivery Address
                </h2>
                <button
                  onClick={() => setAddnew(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Location on Map
                  </label>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={position}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Click on the map to set your location or drag the marker
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                    rows="2"
                    placeholder="Selected address will appear here"
                    value={address}
                    readOnly
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor / Apartment No.
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                      placeholder="e.g. Flat 101, 2nd Floor"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                      placeholder="e.g. Near City Park"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Save Address As
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg border flex items-center ${
                        place === 'Home' 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setPlace('Home')}
                    >
                      <FiHome className="mr-2" /> Home
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg border flex items-center ${
                        place === 'Work' 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setPlace('Work')}
                    >
                      <FiMapPin className="mr-2" /> Work
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-lg border flex items-center ${
                        place && place !== 'Home' && place !== 'Work' 
                          ? 'bg-orange-50 border-orange-500 text-orange-600' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const custom = prompt("Enter custom label (e.g. Friend's House):");
                        if (custom) setPlace(custom);
                      }}
                    >
                      <FiPlus className="mr-2" /> Other
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setAddnew(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center"
                  onClick={handleNewAddress}
                  disabled={isAddressLoading || !address || !floor || !place}
                >
                  {isAddressLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" /> Save Address
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>

        )}
      </AnimatePresence>
    </div>
  );
}
export default Cart;