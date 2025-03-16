import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'boxicons/css/boxicons.min.css';

// Food items data with names
const foodItems = [
  { img: "../src/food/burger.avif", name: "Burger", id: "" },
  { img: "../src/food/Chinese.avif", name: "Chinese", id: "" },
  { img: "../src/food/Dosa.avif", name: "Dosa", id: "" },
  { img: "../src/food/Momo.avif", name: "Momos", id: "" },
  { img: "../src/food/Cake.avif", name: "Cake", id: "" },
  { img: "../src/food/Kachori.avif", name: "Kachori", id: "" },
  { img: "../src/food/Khichdi.avif", name: "Khichdi", id: "" },
  { img: "../src/food/Noodles.avif", name: "Noodles", id: "" },
  { img: "../src/food/Pakoda.avif", name: "Pakoda", id: "" },
  { img: "../src/food/Pasta.avif", name: "Pasta", id: "" },
  { img: "../src/food/PavBhaji.avif", name: "Pav Bhaji", id: "" },
  { img: "../src/food/Pizza.avif", name: "Pizza", id: "" },
  { img: "../src/food/PureVeg.avif", name: "Pure Veg", id: "" },
  { img: "../src/food/Shake.avif", name: "Shake", id: "" },
  { img: "../src/food/SouthIndian.avif", name: "South Indian", id: "" },
  { img: "../src/food/Vada.avif", name: "Vada", id: "" }
];

function FoodSuggestions() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  let sliderRef = useRef(null);
  
  const next = () => {
    sliderRef.slickNext();
  };
  
  const previous = () => {
    sliderRef.slickPrev();
  };

  // Empty arrow component for custom navigation
  function SampleArrow() {
    return <div className="hidden" />;
  }

  // Handle image error
  const handleImageError = (e) => {
    e.target.src = "/placeholder.svg?height=140&width=140";
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 3,
    swipeToSlide: true,
    focusOnSelect: true,
    nextArrow: <SampleArrow />,
    prevArrow: <SampleArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="mt-16 md:mt-20">
        {/* Header with logo and title */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
              <i className="bx bxs-food-menu text-2xl text-amber-600"></i>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Food Cravings?</h2>
              <p className="text-gray-500 text-sm md:text-base">Discover your favorite dishes</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              className="h-10 w-10 flex items-center justify-center bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-full transition-all duration-200 hover:scale-105 hover:bg-amber-50"
              onClick={previous}
              aria-label="Previous items"
            >
              <i className="bx bx-chevron-left text-xl text-gray-700"></i>
            </button>
            <button
              className="h-10 w-10 flex items-center justify-center bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-full transition-all duration-200 hover:scale-105 hover:bg-amber-50"
              onClick={next}
              aria-label="Next items"
            >
              <i className="bx bx-chevron-right text-xl text-gray-700"></i>
            </button>
          </div>
        </div>
        
        {/* Carousel container */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <Slider
            ref={(slider) => {
              sliderRef = slider;
            }}
            {...settings}
          >
            {foodItems.map((item, index) => (
              <div 
                key={index} 
                className="px-2 py-1"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div 
                  className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
                    hoveredIndex === index ? 'shadow-lg scale-105' : 'shadow-sm'
                  }`}
                >
                  <div className="aspect-square h-fit overflow-hidden bg-gray-100">
                    <img
                      className="w-full h-full pb-10 mt-9 object-cover transition-transform duration-500 hover:scale-110"
                      src={item.img || "/placeholder.svg"}
                      alt={item.name}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-center font-medium text-sm">{item.name}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-center text-gray-800 font-medium text-sm truncate">{item.name}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default FoodSuggestions;