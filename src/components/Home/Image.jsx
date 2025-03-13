import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Image() {

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    fade: true,
    waitForAnimate: false,
    autoplaySpeed: 4000,
    cssEase: "linear"
  };

  const data = [
    {
      name: "Daal Makhani",
      img: "../src/food/daal_makhani.jpg",
    },
    {
      name: "Jeera Rice",
      img: "../src/food/jeera_rice.jpg",
    },
    {
      name: "Masala Dosa",
      img: "../src/food/masala_dosa.jpg",
    },
    {
      name: "Paneer Tikka",
      img: "../src/food/paneer_tikka.jpg",
    },
    {
      name: "Thali",
      img: "../src/food/thali1.jpg",
    },
    {
      name:"offer",
      img: "https://www.shutterstock.com/shutterstock/photos/2020536794/display_1500/stock-vector-indian-food-illustration-hand-drawn-sketch-indian-cuisine-vector-illustration-menu-background-2020536794.jpg"
    }
  ];
  return (
    <div className='w-full min-h-auto min-w-full'>
      <div className='w-full p-5'>
      <Slider {...settings}>
        {data.map((d)=>(
          <div className=' bg-white h-auto w-full rounded-xl'>
            <div className='rounded-t-xl flex justify-center items-center '>
              <a href='../app.jsx'><img alt="" srcset={d.img} className='items-center w-full h-[550px] rounded-xl max-h-fit' /></a>
            </div>
            <div>
              <p>{d.name}</p>
            </div>
          </div>
        ))}
        </Slider>
      </div>
    </div>
  )
}

export default Image
