import React, { useEffect, useState } from "react";
import foodData from "../../food/food1.json";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loading from "../../Loading";
import axios from "axios";

function Cart() {
  const [data1, setData1] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [addnew, setAddnew] = useState(false);
  const [topay, setTopay] = useState("");
  const [foodData1, setFoodData1] = useState();
  const [floor, setFloor] = useState("");
  const [landmark, setLandmark] = useState("");
  const [place, setPlace] = useState("");
  const [position, setPosition] = useState([51.505, -0.09]);
  const [saveadd, setSaveadd] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const itemsTotal = data1.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 50; // Example delivery fee
  const extraDiscount = 20; // Example extra discount
  const gstCharges = (itemsTotal + deliveryFee - extraDiscount) * 0.12; // 18% GST
  const totalAmount =
    itemsTotal + deliveryFee - extraDiscount + gstCharges + deliveryTip;

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

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
  });
  useEffect(() => {
    const cartData = () => {
      const data = foodData.foodItems
        .map((food) => {
          const item = localStorage.getItem(food.id);
          return item ? JSON.parse(item) : null;
        })
        .filter((item) => item !== null); // Filter out null values
      setData1(data);
      setTimeout(() => {
        setIsLoading(false);
      }, [2000]);
      setCartCount(data.reduce((total, item) => total + item.quantity, 0));
      localStorage.removeItem("orderAdded");
      localStorage.removeItem("userOrderAdded");
      localStorage.removeItem("orderId");
    };
    cartData();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        // Reverse geocoding to get address (using a free service like Nominatim)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
          .then((response) => response.json())
          .then((data) => {
            setAddress(data.display_name || []);
          });
      });
    }
    const email = localStorage.getItem("userEmail");
    if (email) setIsLogin(true);
    else setIsLogin(false);
  }, []);

  const updateQuantity = (foodId, quantity) => {
    const updatedData = data1
      .map((item) => {
        if (item.id === foodId) {
          window.location.reload();
          const updatedItem = { ...item, quantity: item.quantity + quantity };
          if (updatedItem.quantity > 0)
            localStorage.setItem(foodId, JSON.stringify(updatedItem));
          else localStorage.removeItem(foodId);
          return updatedItem;
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove items with quantity 0
    setData1(updatedData);
    setCartCount(updatedData.reduce((total, item) => total + item.quantity, 0));
  };
  const handlesendaddress = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const response = await axios.post("http://localhost:8000/cart/save", {
        cartItems: data1.map((item) => ({
          foodId: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        email: email,
      });
      console.log("Data saved successfully:", response.data);
    } catch (err) {
      console.error(
        "Error saving data:",
        err.response ? err.response.data : err.message
      );
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      const email = localStorage.getItem("userEmail");
      try {
        const response = await axios.get("http://localhost:8000/cart/address", {
          params: { email },
        });
        console.log("Backend Response:", response.data); // Debugging line
        setSaveadd(response.data.address || []);
      } catch (err) {
        console.error(
          "Error fetching addresses:",
          err.response ? err.response.data : err.message || []
        );
        setSaveadd([]);
      }
    };

    fetchAddresses();
  }, []);

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
        // Reverse geocoding to get address (using a free service like Nominatim)
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
      console.log(position);
      // Reverse geocoding to get address (using a free service like Nominatim)
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
      ></Marker>
    );
  }

  const handlePayment = () => {
    handlesendaddress();
    // Redirect to a payment app or payment gateway
    window.location.href = "/payment-gatway";
  };

  const handleCloseModal = (e) => {
    if (e.target.id === "modal-overlay") {
      setAddnew(false);
    }
  };

  const handleNewAddress = async () => {
    setIsLoading(true);
    const newAddress = `${place}, ${floor}, ${landmark}, ${address}`;
    const email = localStorage.getItem("userEmail");
    try {
      const response = await axios.post(
        "http://localhost:8000/cart/save-address",
        {
          email,
          address: newAddress,
        }
      );
      console.log("Current saveadd:", saveadd); // Debugging line
      setSaveadd((prevSaveadd) => {
        const updatedSaveadd = [...(prevSaveadd || []), newAddress];
        console.log("Updated saveadd:", updatedSaveadd); // Debugging line
        return updatedSaveadd;
      });
      setAddnew(false);
    } catch (err) {
      console.error(
        "Error saving address:",
        err.response ? err.response.data : err.message
      ) || [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    console.log(selectedAddress);
  };

  const handleAddTip = () => {
    const tip = prompt("Enter tip amount: ");
    if (tip) {
      setDeliveryTip(parseFloat(tip));
    }
  };

  if (isLoading === true) {
    return (
      <div className="fixed top-0 h-20 w-20 z-50">
        <Loading />
      </div>
    );
  }
  return (
    <div className="absolute py-10 h-full flex flex-col justify-between right-0 top-10  xl:px-20 bg-gray-100 w-full font-noto-serif-bengali text-gray-800">
      {isLoading ? (
        <div className="max-w-screen">
          <div className="fixed top-20 left-10">
            <Skeleton height={300} width={500} count={1} />
            <Skeleton height={40} width={300} count={1} />
            <Skeleton
              height={800}
              width={300}
              count={3}
              style={{ margin: "20px 0" }}
            />
          </div>
          <div className="fixed right-0 top-10 shadow-xl">
            <Skeleton
              height={800}
              width={500}
              count={1}
              style={{ backgroundColor: "white" }}
            >
              <Skeleton
                height={300}
                width={200}
                count={1}
                style={{ backgroundColor: "black" }}
              />
            </Skeleton>
          </div>
        </div>
      ) : (
        <>
          {cartCount === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl h-[700px] lg:-ml-20 lg:-mr-20 flex flex-col justify-center items-center bg-white gap-2"
            >
              <img
                src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/2xempty_cart_yfxml0"
                className="h-72 w-72"
                alt="Cart"
              />
              <span>Your cart is empty </span>
              <p className="text-sm">You can go to home to view food</p>{" "}
              <Link to="/home" className="bg-green-700 px-3 py-1 text-white">
                View More
              </Link>
            </motion.div>
          ) : (
            <div className="max-w-screen flex justify-center items-start flex-col lg:flex-row lg:-mr-20">
              <div className="flex flex-col w-full lg:w-[850px] p-4 mt-2">
                <div className="bg-white p-4 mb-4 px-10 py-10 max-sm:px-0">
                  {selectedAddress ? (
                    <div className="">
                      <h2 className="text-xl font-bold mb-2 flex justify-start items-center gap-2">
                        Delivery Address
                        <span className="text-center flex justify-center items-center bg-green-600 rounded-full">
                          <svg
                            className="w-6 h-6 text-gray-800 dark:text-white"
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
                              strokeWidth="2"
                              d="M5 11.917 9.724 16.5 19 7.5"
                            />
                          </svg>
                        </span>
                      </h2>
                      <button
                        className="bg-transparent text-orange-600 text-lg"
                        onClick={() => setSelectedAddress()}
                      >
                        Change
                      </button>
                      <div>{selectedAddress}</div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold mb-2">
                        Choose a delivery address
                      </h2>
                      <div className="mt-4">
                        <ul className="w-full grid grid-cols-2 max-sm:grid-cols-1">
                          {saveadd.map((addr, index) => (
                            <li
                              key={index}
                              className="mb-2 w-[350px] text-wrap border hover:shadow-xl p-10 flex flex-col justify-center items-center gap-3"
                            >
                              <span className="">
                                <box-icon type="solid" name="map"></box-icon>
                                {addr.split(",")[0]}
                              </span>
                              {addr.slice()}
                              <button
                                className="ml-4 bg-green-700 text-white font-roboto-condensed px-3 py-1 -mb-5"
                                onClick={() => handleSelectAddress(addr)}
                              >
                                Deliver here
                              </button>
                            </li>
                          ))}
                          <button
                            onClick={() => setAddnew(!addnew)}
                            className="mb-2 w-[350px] h-[200px] text-wrap border hover:shadow-xl p-10 flex flex-col justify-center items-center gap-3 text-xl"
                          >
                            Add New Address
                          </button>
                        </ul>
                      </div>
                      {addnew && (
                        <div
                          id="modal-overlay"
                          onClick={handleCloseModal}
                          className="absolute bg-black bg-opacity-35 w-full -ml-7 right-0 -top-10 h-full z-50"
                        >
                          <motion.div
                            initial={{ opacity: 1, x: -420 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 1, x: -120 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className=" flex justify-end h-full w-[600px] bg-white"
                          >
                            <div className="flex flex-wrap justify-start px-10 py-3 h-full max-w-full w-[500px]">
                              <div className="flex justify-start items-center -ml-3 py-5 h-fit w-full">
                                <img
                                  className="h-4 w-4 m-3 hover:opacity-55 max-sm:absolute font-extralight   max-sm:right-0 max-sm:top-0"
                                  src="https://cdn-icons-png.flaticon.com/128/1828/1828778.png"
                                  alt=""
                                  onClick={() => setAddnew(false)}
                                />
                                <span className="text-xl font-bold">
                                  Save delivery address
                                </span>
                              </div>
                              <div className="h-full w-full">
                                <MapContainer
                                  center={position}
                                  zoom={13}
                                  style={{ height: "250px", width: "100%" }}
                                >
                                  <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                  />
                                  <LocationMarker />
                                </MapContainer>
                                <input
                                  className="border w-full py-5 px-5 text-gray-700 outline-none text-lg"
                                  id="address-input"
                                  type="text"
                                  placeholder="Selected address will appear here"
                                  value={address}
                                  readOnly
                                />
                                <div className="flex flex-col justify-center items-center border mt-5">
                                  <input
                                    className="h-10 w-full outline-none border px-5 py-8 text-lg"
                                    type="text"
                                    placeholder="Floor/plot no."
                                    value={floor}
                                    onChange={(e) => setFloor(e.target.value)}
                                    required
                                  />
                                  <input
                                    className="h-10 w-full outline-none border px-5 py-8 text-lg"
                                    type="text"
                                    placeholder="Landmark"
                                    value={landmark}
                                    onChange={(e) =>
                                      setLandmark(e.target.value)
                                    }
                                    required
                                  />
                                  <input
                                    className="h-10 w-full outline-none px-5 py-8 text-lg"
                                    type="text"
                                    placeholder="Home/Office/others"
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                  />
                                </div>
                                <button
                                  className="bg-green-700 text-white px-4 py-2 rounded w-full mt-4"
                                  onClick={handleNewAddress}
                                >
                                  Save Address
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {(selectedAddress && (
                  <div className="bg-white p-10 px-10">
                    <h2 className="text-xl font-bold mb-2">
                      Choose a payment method
                    </h2>
                    <button
                      className="mt-4 w-full bg-green-700 text-white py-2"
                      onClick={handlePayment}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )) || (
                  <div className="bg-white p-10 px-10 opacity-50">
                    <h2 className="text-xl font-bold mb-2">
                      Choose a payment method
                    </h2>
                    <button
                      className="mt-4 w-full bg-green-700 text-white py-2 cursor-not-allowed"
                      readOnly
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}
              </div>
              <div className=" mr-20 py-2 w-full h-full lg:w-1/4 font-sans">
                <div className="bg-white px-8 py-2 mt-4 text-sm">
                  <h1 className="text-2xl items-center text-center font-bold">
                    Restaurant
                  </h1>
                  <div className="flex flex-col items-center justify-center py-10">
                    {data1.map((foodItem) => (
                      <motion.div
                        key={foodItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="cart-bill flex flex-col gap-5 w-full"
                      >
                        <div className="flex justify-between items-center w-full gap-10 mb-2">
                          <p className="w-[400px]">{foodItem.name}</p>
                          <div className="flex px-1 items-center justify-center w-1/4 border-2 border-gray-300">
                            <button
                              className="px-1 text-gray-400 hover:scale-150 transition duration-100"
                              onClick={() => updateQuantity(foodItem.id, -1)}
                            >
                              -
                            </button>
                            <span className="px-1 font-bold text-[12px] text-green-500">
                              {foodItem.quantity}
                            </span>
                            <button
                              className="px-1 hover:scale-150 transition duration-100 text-green-600"
                              onClick={() => updateQuantity(foodItem.id, 1)}
                            >
                              +
                            </button>
                          </div>
                          <p className="w-9 text-righ flex justify-center items-center ">
                            <box-icon name="rupee"></box-icon>
                            {foodItem.price * foodItem.quantity}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <h2 className="text-sm font-bold mb-2">Bill Details</h2>
                  <div className="flex justify-between mb-2">
                    <span>Items Total</span>
                    <span className="flex justify-center items-center h-5 w-10">
                      <box-icon name="rupee"></box-icon>
                      {itemsTotal}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Delivery Fee</span>
                    <span className="flex justify-center items-center h-5 w-8">
                      <box-icon name="rupee"></box-icon>
                      {deliveryFee}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Extra Discount</span>
                    <span className="flex justify-center items-center h-5 w-9">
                      -<box-icon name="rupee"></box-icon>
                      {extraDiscount}
                    </span>
                  </div>
                  <hr className="py-2" />
                  <div className="flex justify-between mb-2">
                    <span>GST Charges</span>
                    <span className="flex justify-center items-center h-5 w-[50px]">
                      <box-icon name="rupee"></box-icon>
                      {gstCharges.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Delivery Tip</span>
                    {deliveryTip ? (
                      <span className="flex justify-center items-center h-5 w-7">
                        <box-icon name="rupee"></box-icon>
                        {deliveryTip}
                      </span>
                    ) : (
                      <button
                        className="text-orange-600 mb-2"
                        onClick={() => handleAddTip()}
                      >
                        Add Tip
                      </button>
                    )}
                  </div>
                  <hr className="my-2 border-black" />
                  <div className="flex justify-between font-bold py-2">
                    <span>TO PAY</span>
                    <span className="flex justify-center items-center h-5 w-16 gap-0">
                      <box-icon name="rupee"></box-icon>
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
