import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './components/authen/Login';
import Dashboard from './components/dashboard/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute'; 
const router = createBrowserRouter([
  {
    path: "/",
    element: ""
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <Dashboard />
      </ProtectedRoute>
    ),
  }
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} /> 
  </StrictMode>,
)
