// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './components/authen/Login';
import Dashboard from './components/dashboard/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import Goods from './components/goods/Goods'; 
import OrderGoods from './components/procurements/OrderGoods';
import OrderList from './components/procurements/OrderList';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Goods />
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
  },
  {
    path: "/order-goods",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <OrderGoods />
      </ProtectedRoute>
    ),
  },
  {
    path: "/order-list",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <OrderList />
      </ProtectedRoute>
    ),
  }
]);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router} /> 
  // </StrictMode>, 
)
