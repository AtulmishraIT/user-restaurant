import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Sugg(props) {
  const data = [
    {
      img: "../src/food/burger.avif",
      id: "",
    },
    {
      img: "../src/food/Chinese.avif",
      id: "",
    },
    {
      img: "../src/food/Dosa.avif",
      id: "",
    },
    {
      img: "../src/food/Momo.avif",
      id: "",
    },
    {
      img: "../src/food/Cake.avif",
      id: "",
    },
    {
      img: "../src/food/Kachori.avif",
      id: "",
    },,
    {
      img: "../src/food/Khichdi.avif",
      id: "",
    },
    {
      img: "../src/food/Noodles.avif",
      id: "",
    },
    {
      img: "../src/food/Pakoda.avif",
      id: "",
    },
    {
      img: "../src/food/Pasta.avif",
      id: "",
    },
    {
      img: "../src/food/PavBhaji.avif",
      id: "",
    },
    {
      img: "../src/food/Pizza.avif",
      id: "",
    },
    {
      img: "../src/food/PureVeg.avif",
      id: "",
    },
    {
      img: "../src/food/Shake.avif",
      id: "",
    },
    {
      img: "../src/food/SouthIndian.avif",
      id: "",
    },
    {
      img: "../src/food/Vada.avif",
      id: "",
    }
  ];
  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  function SampleNextArrow() {
    return (
      <div
        className="hidden"
      />
    );
  }
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 3,
    swipeToSlide: true,
    focusOnSelect: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SampleNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="w-full mx-2 xl:w-[1500px] xl:px-14">
    <div className="md:mt-24 mt-20 w-[445px] max-md:w-full md:w-full">
      <div className=" flex justify-between w-full">
        <div className="md:text-2xl p-5">Hello, What is in your mind...</div>
        <div className="flex gap-2 justify-center items-center">
          <button
            className="h-10 w-10 text-center bg-gray-200 shadow-xl p-1 cursor-pointer border rounded-full hover:scale-105"
            onClick={previous}
          >
            <box-icon name='chevron-left' ></box-icon>
          </button>
          <button
            className="h-10 w-10 bg-gray-200 shadow-xl cursor-pointer border rounded-full hover:scale-105 p-1"
            onClick={next}
          >
            <box-icon name='chevron-right' ></box-icon>
          </button>
        </div>
      </div>
      <div className="ml-2 mr-0 bg-gray-50 w-full shadow-xl">
        <Slider
          ref={(slider) => {
            sliderRef = slider;
          }}
          {...settings}
        >
          {data.map((d, index) => (
            <div className="p-1">
              <div className="flex justify-center items-center">
                <img
                  className="w-[100px] h-[110px] md:w-[140px] md:h-[140px] content-center object-cover"
                  srcSet={d.img}
                  key={index}
                  alt="Rounded avatar"
                />
              </div>
              <div>
                <p className="text-center"></p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
    </div>
  );
}

export default Sugg;
