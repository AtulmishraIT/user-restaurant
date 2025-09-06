import React from 'react'

function orderstatusFront() {
  const orderId = localStorage.getItem('orderId');

  return (
    <div className='fixed flex flex-col justify-center items-center w-full h-screen bg-gray-100'>
      <div className="order-status-card">
        <h2>Order ID: {orderId}</h2>
        <p>Your order is being processed.</p>
        <p>Estimated delivery time: 3-5 business days.</p>
        <button className="track-button">Track Order</button>
      </div>
      <div className="order-status-front">
        <h1>Order Status</h1>
        <p>Track your order status here.</p>
        <div className="order-status-form">
          <input type="text" placeholder="Enter Order ID" />
          <button>Track Order</button>
        </div>
      </div>
    </div>
  )
}

export default orderstatusFront