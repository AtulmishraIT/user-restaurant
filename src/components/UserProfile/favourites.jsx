import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

function Favourites() {
  const [favData, setFavData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const handleFav = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/getFav", {
          params: { email },
        });
        setFavData(response.data);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    handleFav();
  }, [email]);

  const addToCart = async (foodItem) => {
    try {
      // Fetch existing cart items
      const cartResponse = await axios.get("http://localhost:8000/getCartItems", {
        params: { email },
      });

      let existingCartItems = cartResponse.data || [];

      // Check if the item is already in the cart
      const itemIndex = existingCartItems.findIndex(item => item.foodId === foodItem.id);
      if (itemIndex !== -1) {
        // If the item is already in the cart, increase the quantity
        existingCartItems[itemIndex].quantity += 1;
      } else {
        // If the item is not in the cart, add it with quantity 1
        existingCartItems.push({
          foodId: foodItem.id,
          name: foodItem.name,
          image: foodItem.image,
          quantity: 1,
          price: foodItem.price,
        });
      }

      // Save the updated cart items
      const response = await axios.post("http://localhost:8000/cart/save", {
        email,
        cartItems: existingCartItems,
      });

      if (response.status === 200) {
        alert("Item added to cart successfully!");
        localStorage.setItem(foodItem.id, JSON.stringify(existingCartItems));
        try {
          // Remove the item from favourites
          const removeFromFavResponse = await axios.post("http://localhost:8000/deleteFav", {
            email,
            foodId: foodItem.id, // Send the foodId to remove from favourites
          });
          if (removeFromFavResponse.status === 200) {
            console.log("Item removed from favourites successfully!");
            // Update the favData state to remove the item from the UI
            setFavData(favData.filter(item => item.id !== foodItem.id));
          } else {
            console.error("Failed to remove item from favourites.");
          }
        } catch (error) {
          console.error("Error removing item from favourites:", error);
          alert("There was an error removing the item from favourites.");
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("There was an error adding the item to the cart.");
    }
  };

  return (
    <div className=" -z-20 m-10 flex flex-col justify-start items-start ml-32 h-full w-full ">
      <h1 className="block text-xl font-bold text-gray-700 mb-5">Favourites</h1>
      {isLoading ? (
        <div className="flex gap-10 flex-wrap">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex gap-5 items-start justify-center border-2 border-gray-300 p-5 rounded-lg w-80"
              >
                <Skeleton height={100} width={170} />
                <div className="flex flex-col gap-5 items-center justify-center">
                  <Skeleton height={20} width={100} />
                  <Skeleton height={20} width={100} />
                  <Skeleton height={20} width={100} />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex gap-5 flex-wrap">
          <div className="flex gap-5 flex-wrap">
            {favData.length > 0 ? (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
                {favData.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-5 items-start justify-center border border-gray-300 p-5 rounded-lg w-fit h-40"
                  >
                    <h1 className="h-40 w-40">
                      <img src={item.image} alt="Found" />
                    </h1>
                    <div className="flex flex-col gap-2 items-start justify-center">
                      <h1 className="text-lg">{item.name}</h1>
                      <h1>
                        <span>Total Price: </span>
                        {item.price}
                      </h1>
                      <button
                        className="bg-green-600 text-sm px-2 py-1 text-white"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-fit">Can't see any Favourites </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Favourites;