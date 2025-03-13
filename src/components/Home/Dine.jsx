import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Initial chairs data
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

const email = localStorage.getItem('userEmail');
// Send initial chairs data to the database
const sendChairs = async () => {
  const response = await axios.post('http://localhost:8000/Dine/setChairs', {email, chairs: initialChairs });
  return response.data;
};

// Fetch the chairs from the API
const fetchChairs = async () => {
  const response = await axios.get('http://localhost:8000/Dine/chairs', { params: { email } });
  return response.data;
};

// Update chair status
const updateChairStatus = async (id,occupied,email,userName,userPhone,time) => {
  const response = await axios.patch(`http://localhost:8000/Dine/chairs/${id}`, { occupied, email, userName, userPhone, time });
  return response.data;
};

const Dine = () => {
  const [chairs1, setChairs1] = useState([]);
  const [selectedChair, setSelectedChair] = useState(null);
  const [userName, setName] = useState('');
  const [userPhone, setPhone] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const initializeChairs = async () => {
      const chairsData = await fetchChairs();
      if (chairsData.length === 0) {
        await sendChairs();
      } else {
        setChairs1(chairsData);
      }
      if(chairsData.occupied === true){
        alert('This chair is already occupied');
      }
    };
    document.getElementById('datetime').value = new Date().toISOString().substring(0, 10); // Set to current date and time
    document.getElementById('datetime').disabled = false; // Enable the input
    document.getElementById('datetime').setAttribute('min', new Date().toISOString().substring(0, 16)); // Set min to current date
    initializeChairs();
  }, []);

  // Load chairs
  useEffect(() => {
    const loadChairs = async () => {
      try {
        setChairs1(await fetchChairs());
      } catch (error) {
        console.error('Error fetching chairs data:', error);
      }
    };
    loadChairs();
  }, []);


  // Handle chair click (toggle occupied state)
  const handleChairClick = async (chairs, occupied) => {
    if(email){
    if(occupied === true){
      alert('This chair is already occupied');
    }
    else{
      const updatedChair = await updateChairStatus(chairs, !occupied, email, userName, userPhone, time);
    setChairs1(chairs1.map(chair => (chair.chairs === chairs ? updatedChair : chair)));
    }
  
    console.log(occupied);
    setSelectedChair(null);
  }
  else{
    alert('Please login to book a chair');
    window.location.href = '/login';
  }
  };
  const handleSelectedChair = (chairId) => {
    setSelectedChair(chairId);
  };

  return (
    <div className="flex flex-col items-center p-6 mt-20 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dine-In Seating</h1>
      <div className="flex items-center justify-center gap-10 max-lg:flex-col max-sm:ml-5">
      <div className="grid grid-cols-4 gap-4 max-sm:grid-cols-2 bg-white px-20 max-xl:px-5 py-10 max-sm:w-fit">
        {chairs1.map((chair, index) => (
          <div className="flex flex-col items-center justify-center gap-2">
          <div
            key={index}
            className={`w-32 h-32 flex items-center justify-center rounded-lg cursor-pointer ${
              chair.occupied ? 'bg-red-500' : 'bg-green-500'
            }`}
            onClick={() => handleSelectedChair(chair.chairs)}
          >
            <box-icon name='chair'></box-icon>
            <span className="text-white font-semibold">{chair.chairs}</span>
          </div>
              {selectedChair === chair.chairs && <div className="flex justify-start items-center h-fit p-1 w-20 bg-white -mb-2"><button className="h-10 w-fit px-5 bg-green-500" onClick={() => handleChairClick(chair.chairs, chair.occupied)}>Confirm</button></div>}
          </div>
        ))}
      </div>
      <div className="h-full w-96 bg-white flex flex-col items-center justify-start p-6 max-lg:w-full">
      <h1 className="text-3xl font-bold mb-6">Dine-In details</h1>
        <div className="flex flex-col items-center gap-0 max-lg:w-full">
          <div className="flex justify-start w-full items-start gap-2 border px-2 py-2 bg-white"><input type="text" className="text-lg w-full p-2 max-w-full outline-none" value={userName} placeholder="Name" onChange={(e) => setName(e.target.value)} /></div>
          <div className="flex justify-center w-full items-center gap-2 border px-2 py-2 bg-white"><input type="text" className="text-lg p-2 w-full max-w-full outline-none " value={email} placeholder="Email" /></div>
          <div className="flex justify-center w-full items-center gap-2 border px-2 py-2 bg-white"><input type="text" className="text-lg p-2 w-full max-w-full outline-none " value={userPhone} placeholder="Mobile No." onChange={(e)=> setPhone(e.target.value)} /></div>
          <div className="mt-10 flex flex-col justify-center w-full items-center gap-2 border px-2 py-2 bg-white">
            <input type="datetime-local" id="datetime"  placeholder="Date and Time" className="text-lg p-2 w-full max-w-full outline-none" value={time} onChange={(e) => setTime(e.target.value)} />
            <div className="flex justify-center items-center gap-2 border px-12 py-1 bg-white"><span className="text-xl">SELECTED CHAIR </span><input type="text" className="text-xl p-2 size-10 outline-none cursor-not-allowed" value={selectedChair} readOnly /></div>
            <div><button className="bg-green-500 w-80 px-10 py-2">CONFIRM</button></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dine;