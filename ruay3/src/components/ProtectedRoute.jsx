import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // ตรวจสอบว่า authToken มีอยู่ใน localStorage หรือไม่
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        // ถ้าไม่มี token ให้เปลี่ยนเส้นทางกลับไปที่หน้า Login
        return <Navigate to="/" replace />;
    }

    // ถ้ามี token ให้อนุญาตเข้าถึงหน้าได้
    return children;
};

export default ProtectedRoute;
