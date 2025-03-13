import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {motion,AnimatePresence} from 'framer-motion'
import axios from "axios";

function Cards() {
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fav, setFav] = useState({});
  const [foodData1, setFoodData1] = useState();
  const email = localStorage.getItem("userEmail");

  useEffect(()=>{
    const GetFoodData = async () => {
    try {
      const  response = await axios.get("http://localhost:8000/getFoodData");
      setFoodData1(Array.isArray(response.data.foodItems) ? response.data.foodItems : []);
    } catch (error) {
      console.log(error);
    }
  }
  GetFoodData();
  })

  useEffect(() => {
    // Initialize cart from localStorage and filter out non-cart items
    const storedCart = Object.keys(localStorage)
      .map(key => {
        try {
          const item = JSON.parse(localStorage.getItem(key));
          // Check if the item has the properties of a cart item
          if (item && item.id && item.quantity) {
            return item;
          }
        } catch (e) {
          return null;
        }
        return null;
      })
      .filter(item => item !== null);
    setCart(storedCart);
  }, []);

  const handleCheckboxChange = (e) => {
    try {
      if (e.target.checked) {
        setTimeout(() => {
          setCategory(e.target.value);
        }, 100);
      } else {
        setCategory("");
      }
    } finally {
    }
  };

  const AddtoCart = (food) => {
    window.location.reload()
    if(email){
    const existingItem = cart.find(item => item.id === food.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem(food.id, JSON.stringify(updatedCart.find(item => item.id === food.id)));
  }
  else{
    alert("Login First");
    window.location.href = "/login";
    localStorage.clear();
  }
  };

  useEffect(()=> {
    if(!email){
      localStorage.clear();
    }
  })

  const updateQuantity = (foodId, quantity) => {
    const updatedCart = cart.map((item) => {
      if (item.id === foodId) {
        const updatedItem = { ...item, quantity: item.quantity + quantity };
        if(updatedItem.quantity > 0){
          setTimeout(() => {
            window.location.reload()
          }, 300);
          localStorage.setItem(foodId, JSON.stringify(updatedItem));
        }
        else {
          window.location.reload()
          localStorage.removeItem(foodId)}
        return updatedItem;
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove items with quantity 0
    setCart(updatedCart);
  };
  
  const handleFav = (foodId) =>{
    setFav((prevFav) => ({
      ...prevFav !== foodId.id, [foodId.id] : !prevFav[foodId.id],
    }))
    try {
      if(email){
        console.log(email, foodId);
      axios.post("http://localhost:8000/fav", {
        email,
        foodId
      }).then((res) => {
        console.log(res.data);
      });
    }
    else{
      window.location.href = "/login";
      alert("Login First, then add to favourites");
      localStorage.clear();
    }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="font-sans ml-36 mr-28">
        <div className="flex flex-row gap-2">
        <div className="relative flex ml-10 justify-start items-end w-fit content-start py-2">
          <Skeleton height={20} width={20} count={1} />
          <Skeleton height={40} width={40} count={1} style={{ margin: '0 10px' }} />
        </div>
        <div className="relative flex justify-start items-end w-fit content-start py-2">
          <Skeleton height={20} width={20} count={1} />
          <Skeleton height={40} width={40} count={1} style={{ margin: '0 10px' }} />
        </div>
        </div>
        <div className="relative flex flex-wrap">
          {Array(170).fill().map((_, index) => (
            <div key={index} className="p-4 w-1/3 flex flex-wrap">
              <div className="border h-full rounded-lg p-4">
                <Skeleton height={240} width={350} />
                <Skeleton height={30} width={150} style={{ marginTop: '10px' }} />
                <Skeleton height={10} width={80} style={{ marginTop: '10px' }} />
                <div className="flex justify-between">
                <Skeleton height={40} width={70} style={{ marginTop: '20px' }} />
                <Skeleton height={40} width={150} style={{ marginTop: '20px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      ) : (
        <div className="font-sans max-sm:-mr-8">
           <div className="relative flex justify-end items-end w-[500px] max-sm:w-full content-start py-2">
            <h1 className="w-full text-right gap-2 flex justify-end items-center">
              <input
                type="checkbox"
                value="Veg"
                className="h-10 w-5"
                id="cate"
                onChange={handleCheckboxChange}
                checked={category === "Veg"}
              />
              <img
                className="h-10 w-10"
                src="https://t4.ftcdn.net/jpg/05/47/36/93/240_F_547369319_CeGcFwxMj3QFen7F3ICMca9inkucYQKv.jpg"
                alt=""
              />
              
            </h1>
            <h1 className="w-full text-left gap-2 px-5 flex justify-start items-center">
              <input
                type="checkbox"
                value="Non-veg"
                className="h-10 w-5"
                id="cate"
                onChange={handleCheckboxChange}
                checked={category === "Non-veg"}
              />
              <img
                className="h-9 w-9"
                src="https://t3.ftcdn.net/jpg/11/29/94/92/240_F_1129949241_weSI8zfHhafNR9HHv2ZFhnHNbyLXsYVQ.jpg"
                alt=""
              />
            </h1>
          </div>
          <div className="w-full flex justify-center max-xl:flex-wrap items-center bg-blue overflow-hidden flex-wrap">
            {foodData1[0].foodItems
              .filter((food1) => !category || food1.category === category)
              .map((food1) => (
                <div
                  id={food1.id}
                  className="w-full max-w-sm max-sm:flex mx-2 mb-7 bg-white border border-gray-200 rounded-lg shadow-lg max-sm:mb-5 hover:scale-95 transition duration-200"
                >
                  <a href="#" className="">
                    <img
                      className="p-8 max-sm:p-3 rounded-t-lg max-sm:h-48 max-sm:w-52 max-sm:object-cover w-full h-72 object-cover"
                      src={food1.image}
                      alt="product image"
                    />
                  </a>
                  <div className="px-5 pb-5 -mt-3 max-sm:-mt-0 max-sm:py-3">
                    <a href="#">
                      <h5 className="text-xl font-semibold flex justify-between mx-1 tracking-tight text-gray-900  max-sm:text-lg">
                        {food1.name}
                        <p className="text-sm">
                          {food1.category === "Non-veg" ? (
                            <span className="text-red-500">Non-veg</span>
                          ) : (
                            <span className="text-green-500">Veg</span>
                          )}
                        </p>
                      </h5>
                    </a>
                    <div className="flex items-center mt-2.5 mb-5">
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-yellow-300"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                        <svg
                          className="w-4 h-4 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                        5.0
                      </span>
                    </div>
                    <div className="flex items-center justify-between mr-2 max-sm:flex-col max-sm:items-start max-sm:gap-2">
                      <span className="text-2xl text-gray-700 flex justify-center items-start -mr-5 max-sm:text-lg">
                        <box-icon name="rupee"></box-icon>
                        {food1.price}
                      </span>
                      <AnimatePresence>
                      {cart.find(item => item.id === food1.id) ? (
                      <motion.div 
                      key="quantity-controls"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                      className="flex items-center border w-1/3 max-sm:w-full border-gray-300 justify-center mt-4">
                        <button
                          className="text-gray-400 p-2 hover:scale-150 transition duration-100"
                          onClick={() => updateQuantity(food1.id, -1)}
                        >
                          -
                        </button>
                        <motion.span 
                        key={cart.find(item => item.id === food1.id)?.quantity}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="mx-2 font-bold text-sm text-green-500">
                          {cart.find(item => item.id === food1.id)?.quantity}
                        </motion.span>
                        <button
                          className="p-2 hover:scale-150 transition duration-100"
                          onClick={() => updateQuantity(food1.id, 1)}
                        >
                          +
                        </button>
                      </motion.div>
                    ) : (
                      <div className="flex justify-center items-center -mt-4">
                      <motion.button
                      key="add-to-cart"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y:-20 }}
                          transition={{ duration: 0.3 }}
                        className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => AddtoCart(food1)}
                      >
                        Add to Cart
                      </motion.button>
                      <button
                      className={` mt-3 h-10 w-10  ${fav[food1.id] ? 'text-red-500' : 'text-gray-500'} bg-gray-50 p-2 rounded-full hover:scale-105 transition duration-100 ml-2`}
                      onClick={() => handleFav(food1)}
                    >
                      <box-icon name="heart" type={fav[food1.id] ? 'solid' : 'regular'}></box-icon>
                    </button>
                    </div>
                    )}
                    </AnimatePresence>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cards;
