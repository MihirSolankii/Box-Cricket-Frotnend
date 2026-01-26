import Header from '../components/Header'
import React from 'react'

function index() {
  return (
    <div>
      <div className="min-h-screen bg-background flex font-sans text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <DashboardContent />
      </div>
    </div>
    </div>
  )
}

export default index
