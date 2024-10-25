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
import GoodsList from './components/goods/GoodsList'
import OrderGoods from './components/procurements/OrderGoods';
import OrderList from './components/procurements/OrderList';
import Category from './components/categories/Category';
import GetReceipt from './components/receipts/getReceipt';
import Stock from './components/goods/Stock';
import Customer from './components/customers/Customer';
import Supplier from './components/suppliers/Supplier';
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
  },
  {
    path: "/category",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <Category />
      </ProtectedRoute>
    ),
  },
  {
    path: "/getAllReceipts",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <GetReceipt />
      </ProtectedRoute>
    ),
  },
  {
    path: "/getStock",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <Stock />
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <Customer />
      </ProtectedRoute>
    ),
  },
  {
    path: "/suppliers",
    element: (
      <ProtectedRoute>  {/* ใช้ ProtectedRoute */}
        <Supplier />
      </ProtectedRoute>
    ),
  },
  {
    path: "/goods",
    element: (
      <ProtectedRoute>
        <GoodsList />
      </ProtectedRoute>
    )
  }
]);
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <RouterProvider router={router} /> 
  // </StrictMode>, 
)
