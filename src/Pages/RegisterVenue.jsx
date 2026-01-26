import React from 'react'
// import Index from '../Admin/pages/index'
import Sidebar from '@/Admin/components/Sidebar'
import Header from '@/Admin/components/Header'
import DashboardContent from '@/Admin/components/DashboardContent'
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from "../../../admin/admin-dashboard/src/App"

function RegisterVenue() {
  return (
    
  <div className="min-h-screen bg-background flex font-sans text-foreground">
     <App/>
    </div>
  
  )
}

export default RegisterVenue
