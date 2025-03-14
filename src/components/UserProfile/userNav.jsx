import React, {useEffect, useState} from "react";
import { Link, Routes, Route } from "react-router-dom";
import Favourites from "./favourites";
import Payment from "./payment";
import Logout from "./Logout";
import { useNavigate } from "react-router-dom";
import UserProfile from './UserProfile';
import Order from './order';
import Contact from './contact';
import Addresses from './Addresses';
import { motion } from "framer-motion";
import Dinein from "./dinein";

function UserNav(props) {
  const [activeItem, setActiveItem] = useState('');
  const active = localStorage.getItem('activeItem');
  const [isMenu, setIsMenu] = useState(false);

  useEffect(() => {
    setActiveItem(active);
    setIsMenu(false);
  }, [active]);

  const handleItemClick = (item) => {
    localStorage.setItem('activeItem', item);
    item === 'logout' && localStorage.clear();
    setActiveItem(item);
  };  

  const toggleMenu = () => {
    setIsMenu(!isMenu);
  };
  return (
    <div className="grid grid-cols-2 gap-10 overflow-hidden w-[1100px] max-lg:w-full max-lg:h-[100vh] max-sm:bg-white">
      <div className="flex flex-col gap-5 items-start w-fit justify-start h-fit left-0 max-sm:justify-center max-sm:items-center bg-indigo-100 max-sm:bg-white py-20">
        <ul className=" flex flex-col gap-2 items-start justify-start relative max-lg:hidden">
          <li>
            <Link to="order" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'profile' ? 'bg-white' : ''}`} onClick={() => handleItemClick('profile')} >
              <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                  <box-icon name="package"></box-icon>
                </span>
                <span className="hover:text-[17.5px] flex justify-start items-start hover:text-gray-900">
                  Orders
                </span>
              </p>
            </Link>
          </li>
          <li>
          <Link to="Dine" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'dine' ? 'bg-white' : ''}`} onClick={() => handleItemClick('dine')}>
              <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                  <box-icon type="solid" name="heart-circle"></box-icon>
                </span>
                <span className="hover:text-[17.5px] hover:text-gray-900">
                  Dine-in
                </span>
              </p>
            </Link>
          </li>
          <li>
            <Link to="favourites" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'favourites' ? 'bg-white' : ''}`} onClick={() => handleItemClick('favourites')}>
              <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                  <box-icon type="solid" name="heart-circle"></box-icon>
                </span>
                <span className="hover:text-[17.5px] hover:text-gray-900">
                  Favourites
                </span>
              </p>
            </Link>
          </li>
          <li>
            <Link to="payment" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'payment' ? 'bg-white' : ''}`} onClick={() => handleItemClick('payment')}>
              <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                  <box-icon name="credit-card" type="solid"></box-icon>
                </span>
                <span className="hover:text-[17.5px] hover:text-gray-900">
                  Payment
                </span>
              </p>
            </Link>
          </li>
          <li>
            <Link to="addresses" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'addresses' ? 'bg-white' : ''}`} onClick={() => handleItemClick('addresses')}>
              <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                  <box-icon type="solid" name="edit-location"></box-icon>
                </span>
                <span className="hover:text-[17.5px] hover:text-gray-900">
                  Addresses
                </span>
              </p>
            </Link>
          </li>
          <li>
            <Link to="contact" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'contact' ? 'bg-white' : ''}`} onClick={() => handleItemClick('contact')}>
              <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                  <box-icon name="contact" type="solid"></box-icon>
                </span>
                <span className="hover:text-[17.5px] hover:text-gray-900">
                  Contact Us
                </span>
              </p>
            </Link>
          </li>
        </ul>

        <p className="text-center text-gray-500 text-xs ml-5 max-lg:hidden">
          © 2021 Restaurant. All rights reserved.
        </p>
      </div>
      <div className="xl:hidden max-md:block absolute left-0 bg-white">
        <div className="flex justify-end items-center px-4">
          <button onClick={toggleMenu}><box-icon size='30px' name='menu' ></box-icon></button>
        </div>
        {isMenu ? (
          <div className="absolute left-0 top-0 bg-white w-60 h-[100vh]">
            <div className="flex justify-end items-center p-4">
          <button onClick={toggleMenu}><box-icon size='30px' name='x'></box-icon></button>
        </div>
            <ul className="flex flex-col gap-2 items-start justify-start relative">
              <li>
                <Link to="order" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'profile' ? 'bg-white' : ''}`} onClick={() => handleItemClick('profile')} >
                  <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                    <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                      <box-icon name="package"></box-icon>
                    </span>
                    <span className="hover:text-[17.5px] flex justify-start items-start hover:text-gray-900">
                      Orders
                    </span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="Dine" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'dine' ? 'bg-white' : ''}`} onClick={() => handleItemClick('dine')}>
                  <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                    <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                      <box-icon type="solid" name="heart-circle"></box-icon>
                    </span>
                    <span className="hover:text-[17.5px] hover:text-gray-900">
                      Dine-in
                    </span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="favourites" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'favourites' ? 'bg-white' : ''}`} onClick={() => handleItemClick('favourites')}>
                  <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                    <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                      <box-icon type="solid" name="heart-circle"></box-icon>
                    </span>
                    <span className="hover:text-[17.5px] hover:text-gray-900">
                      Favourites
                    </span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="payment" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'payment' ? 'bg-white' : ''}`} onClick={() => handleItemClick('payment')}>
                  <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                    <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                      <box-icon name="credit-card" type="solid"></box-icon>
                    </span>
                    <span className="hover:text-[17.5px] hover:text-gray-900">
                      Payment
                    </span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="addresses" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'addresses' ? 'bg-white' : ''}`} onClick={() => handleItemClick('addresses')}>
                  <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                    <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                      <box-icon type="solid" name="edit-location"></box-icon>
                    </span>
                    <span className="hover:text-[17.5px] hover:text-gray-900">
                      Addresses
                    </span>
                  </p>
                </Link>
              </li>
              <li>
                <Link to="contact" className={`w-60 flex ml-4 flex-col p-4 items-start justify-center ${activeItem === 'contact' ? 'bg-white' : ''}`} onClick={() => handleItemClick('contact')}>
                  <p className="flex justify-center items-center gap-2 text-[17px] font-bold text-gray-700">
                    <span className="bg-gray-300 h-9 w-9 flex justify-center items-center rounded-full ">
                      <box-icon name="contact" type="solid"></box-icon>
                    </span>
                    <span className="hover:text-[17.5px] hover:text-gray-900">
                      Contact Us
                    </span>
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
      <div className="-ml-96 max-sm:-ml-80 max-lg:-ml-[470px]">
      <Routes>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="logout" element={ <Logout /> } />
          <Route path="payment" element={<Payment />} />
          <Route path="order" element={<Order />} />
          <Route path="Dine" element={<Dinein />} />
          <Route path="contact" element={<Contact />} />
          <Route path="addresses" element={<Addresses />} />
        </Routes>
      </div>
    </div>
  );
}

export default UserNav;
