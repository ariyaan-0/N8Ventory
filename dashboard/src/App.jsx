import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Ela Inventory Dashboard
        </h1>
        <p className="text-gray-700">
          Frontend setup with React + Vite + TailwindCSS is complete!
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
