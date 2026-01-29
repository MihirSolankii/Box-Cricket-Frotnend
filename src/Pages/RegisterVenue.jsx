import React from 'react'
// import Index from '../Admin/pages/index'
// import Sidebar from '@/Admin/components/Sidebar'
// import Header from '@/Admin/components/Header'
// import DashboardContent from '@/Admin/components/DashboardContent'
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
// import App from "../../../admin/admin-dashboard/src/App"

function RegisterVenue() {


  useEffect(() => {
    // Redirect to the external admin URL after a short delay
    const timer = setTimeout(() => {
      window.location.href = "https://box-cricket-admin-hazel.vercel.app/signup";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    
 <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans text-foreground p-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto" />
        <h2 className="text-xl font-bold">Switching to Admin Portal</h2>
        <p className="text-gray-500">Please wait while we redirect you to the registration page...</p>
      </div>
      </div>
  
  )
}

export default RegisterVenue
