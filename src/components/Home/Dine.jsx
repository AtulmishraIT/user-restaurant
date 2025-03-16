import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const initialChairs = [
  { chairs: 1, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 2, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 3, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 4, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 5, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 6, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 7, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 8, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 9, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 10, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 11, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 12, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 13, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 14, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 15, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 16, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
];

const Dine = () => {
  const [chairs, setChairs] = useState([]);
  const [selectedChair, setSelectedChair] = useState(null);
  const [userName, setName] = useState('');
  const [userPhone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  
  const email = localStorage.getItem('userEmail');

  const sendChairs = async () => {
    try {
      const response = await axios.post('http://localhost:8000/Dine/setChairs', { email, chairs: initialChairs });
      return response.data;
    } catch (error) {
      console.error('Error setting chairs:', error);
      setError('Failed to initialize seating. Please try again later.');
      return [];
    }
  };

  const fetchChairs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/Dine/chairs', { params: { email } });
      return response.data;
    } catch (error) {
      console.error('Error fetching chairs:', error);
      setError('Failed to load seating information. Please try again later.');
      return [];
    }
  };

  const updateChairStatus = async (id, occupied, email, userName, userPhone, time) => {
    try {
      setLoading(true);
      const response = await axios.patch(`http://localhost:8000/Dine/chairs/${id}`, { 
        occupied, 
        email, 
        userName, 
        userPhone, 
        time 
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error updating chair status:', error);
      setError('Failed to book your seat. Please try again later.');
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    const initializeChairs = async () => {
      setLoading(true);
      const chairsData = await fetchChairs();
      if (chairsData.length === 0) {
        await sendChairs();
        const newChairsData = await fetchChairs();
        setChairs(newChairsData);
      } else {
        setChairs(chairsData);
      }
      setLoading(false);
    };
    
    // Set min date to today
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 16);
    setTime(formattedDate);
    
    initializeChairs();
  }, []);

  const handleChairClick = async (chairId, occupied) => {
    if (!email) {
      setError('Please login to book a chair');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    if (occupied) {
      setError('This chair is already occupied');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    
    if (!userName || !userPhone || !time) {
      setError('Please fill in all required fields');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(userPhone)) {
      setError('Please enter a valid 10-digit phone number');
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    
    const updatedChair = await updateChairStatus(chairId, true, email, userName, userPhone, time);
    if (updatedChair) {
      setChairs(chairs.map(chair => (chair.chairs === chairId ? updatedChair : chair)));
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedChair(null);
      }, 3000);
    }
  };

  const handleSelectedChair = (chairId) => {
    setSelectedChair(chairId);
  };

  const handleConfirmBooking = () => {
    if (selectedChair) {
      const chair = chairs.find(c => c.chairs === selectedChair);
      if (chair) {
        handleChairClick(chair.chairs, chair.occupied);
      }
    } else {
      setError('Please select a chair first');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen mt-12 bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Dine-In Reservation</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select your preferred seating and make a reservation for your next visit
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seating Layout */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Seating Layout
                  </h2>
                  <button 
                    onClick={() => setShowLegend(!showLegend)}
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-1 rounded-md text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Legend
                  </button>
                </div>
                
                {showLegend && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50 p-4 border-b"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded mr-2"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
                        <span className="text-sm">Occupied</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-indigo-500 rounded mr-2"></div>
                        <span className="text-sm">Selected</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {chairs.map((chair) => (
                      <motion.div 
                        key={chair.chairs} 
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <motion.div
                          className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer shadow-md transition-colors ${
                            selectedChair === chair.chairs 
                              ? 'bg-indigo-500 text-white' 
                              : chair.occupied 
                                ? 'bg-red-500 text-white' 
                                : 'bg-green-500 text-white'
                          }`}
                          onClick={() => !chair.occupied && handleSelectedChair(chair.chairs)}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                          </svg>
                          <span className="text-xl font-bold">{chair.chairs}</span>
                          {chair.occupied && (
                            <span className="text-xs mt-1 px-2 py-0.5 bg-white/20 rounded-full">Booked</span>
                          )}
                        </motion.div>
                        
                        {selectedChair === chair.chairs && !chair.occupied && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-center"
                          >
                            <span className="text-sm font-medium text-indigo-600">Selected</span>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                <div className="p-6 bg-indigo-600 text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Reservation Details
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </motion.div>
                    )}
                    
                    {bookingSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 text-green-800 p-4 rounded-lg flex items-start"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Your reservation has been confirmed!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={userName}
                          placeholder="John Doe"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 sm:text-sm cursor-not-allowed"
                          value={email || ''}
                          readOnly
                        />
                      </div>
                      {!email && (
                        <p className="mt-1 text-xs text-red-600">Please login to make a reservation</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={userPhone}
                          placeholder="1234567890"
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="datetime-local"
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Selected Chair</span>
                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${
                          selectedChair ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'
                        } font-bold text-lg`}>
                          {selectedChair || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={handleConfirmBooking}
                      disabled={loading || !selectedChair}
                      className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        loading || !selectedChair
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm Reservation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Restaurant Information */}
        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-indigo-600 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Reservation Information
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>
                  <p className="mt-1 text-sm text-gray-500">Monday - Friday: 11:00 AM - 10:00 PM</p>
                  <p className="mt-1 text-sm text-gray-500">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                  <p className="mt-1 text-sm text-gray-500">Phone: (123) 456-7890</p>
                  <p className="mt-1 text-sm text-gray-500">Email: info@restaurant.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Location</h3>
                  <p className="mt-1 text-sm text-gray-500">123 Restaurant Street</p>
                  <p className="mt-1 text-sm text-gray-500">Foodville, FD 12345</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Reservation Policy</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>• Reservations can be made up to 30 days in advance.</p>
                <p>• Please arrive within 15 minutes of your reservation time.</p>
                <p>• For parties of 6 or more, please call us directly.</p>
                <p>• Cancellations should be made at least 24 hours in advance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dine;