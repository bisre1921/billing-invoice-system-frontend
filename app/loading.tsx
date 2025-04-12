// app/loading.tsx
import React from 'react'

const GlobalLoading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent"></div>
    </div>
  )
}

export default GlobalLoading
