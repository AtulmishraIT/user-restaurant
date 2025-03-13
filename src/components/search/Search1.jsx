import React, { useState, useEffect } from "react";
import {motion,AnimatePresence} from 'framer-motion'
import axios from 'axios'

function Search() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [foodData, setFoodData] = useState([]);
    
  useEffect(() => {
    const GetFoodData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getFoodData");
        setFoodData(Array.isArray(response.data.foodItems) ? response.data.foodItems : []);
      } catch (error) {
        console.log(error);
      }
    };
    GetFoodData();
  }, []);

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

  // Filter food items based on the search query
  const filteredFoodItems = foodData.length > 0 && foodData[0].foodItems
    ? foodData[0].foodItems.filter(item =>
        (item.name && item.name.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const AddtoCart = (food) => {
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
  };
  const updateQuantity = (foodId, quantity) => {
    const updatedCart = cart.map((item) => {
      if (item.id === foodId) {
        const updatedItem = { ...item, quantity: item.quantity + quantity };
        if(updatedItem.quantity > 0)
          localStorage.setItem(foodId, JSON.stringify(updatedItem));
        else{ 
          window.location.reload()
          localStorage.removeItem(foodId)}
        return updatedItem;
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove items with quantity 0
    setCart(updatedCart);
  };


  return (
    <div className="flex flex-col justify-center items-center mt-20 flex-wrap 2xl:w-full mx-3 h-full max-sm:mt-32 bg-slate-50">
      <div className="fixed mt-20 top-0 flex flex-row items-center justify-between md:flex md:w-auto md:order-1">
        <div className="border flex justify-center items-center mt-10 bg-white">
          <span className="h-10 w-10 flex justify-center items-center border-r-2">
            <box-icon name="search"></box-icon>
          </span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            className="w-[800px] max-sm:w-full p-2 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="button"
            className="bg-green-600 hover:bg-green-700 p-2 w-20"
            value="search"
          />
        </div>
      </div>
      <div className="relative top-24 flex flex-wrap justify-center">
        {filteredFoodItems.length > 0 ? (
          filteredFoodItems.map((data1) => (
            <div
              key={data1.id}
              className="w-full max-w-sm max-sm:flex mx-2 mb-7 bg-white border border-gray-200 rounded-lg shadow-lg max-sm:mb-5 hover:scale-95 transition duration-200"
            >
              <a href="#">
                <img
                  className="p-8 max-sm:p-3 max-sm:h-48 max-sm:w-52 max-sm:object-cover w-full h-72 object-cover"
                  src={data1.image}
                  alt="product image"
                />
              </a>
              <div className="px-5 pb-5 -mt-3 max-sm:-mt-0 max-sm:py-3">
              <a href="#">
                      <h5 className="text-xl font-semibold flex justify-between mx-1 tracking-tight text-gray-900  max-sm:text-lg">
                        {data1.name}
                        <p className="text-sm">
                          {data1.category === "Non-veg" ? (
                            <span className="text-red-500">Non-veg</span>
                          ) : (
                            <span className="text-green-500">Veg</span>
                          )}
                        </p>
                      </h5>
                    </a>
                <div className="flex items-center mt-2.5 mb-5">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {[...Array(4)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-300"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 22 20"
                      >
                        <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                      </svg>
                    ))}
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
                        {data1.price}
                      </span>
                      <AnimatePresence>
                      {cart.find(item => item.id === data1.id) ? (
                      <motion.div 
                      key="quantity-controls"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                      className="flex items-center flex-wrap border w-1/3 border-gray-300 justify-center mt-4">
                        <button
                          className="text-gray-400 p-2 bg-gray-50 hover:scale-150 transition duration-100"
                          onClick={() => updateQuantity(data1.id, -1)}
                        >
                          -
                        </button>
                        <motion.span 
                        key={cart.find(item => item.id === data1.id)?.quantity}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="mx-2 font-bold text-sm text-green-500">
                          {cart.find(item => item.id === data1.id)?.quantity}
                        </motion.span>
                        <button
                          className="p-2 hover:scale-150 transition duration-100"
                          onClick={() => updateQuantity(data1.id, +1)}
                        >
                          +
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                      key="add-to-cart"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y:-20 }}
                          transition={{ duration: 0.3 }}
                        className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
                        onClick={() => AddtoCart(data1)}
                      >
                        Add to Cart
                      </motion.button>
                    )}
                    </AnimatePresence>
                    </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No matching food items found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;