import React from 'react'

const Loading = () => {
  return (
  <div className="fixed top-0 left-0 w-full h-0.5 bg-transparent -z-50">
    <div className="h-full bg-red-500 animate-loading"></div>
  </div>
  )
}

export default Loading