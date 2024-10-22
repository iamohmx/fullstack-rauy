import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import Graph from './Graph'; // import Graph component

const Dashboard = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    // ข้อมูลสำหรับการขาย
    const [salesData, setSalesData] = useState([]); 
    const [salesDates, setSalesDates] = useState([]); 

    // ข้อมูลสำหรับการซื้อ
    const [purchaseData, setPurchaseData] = useState([]); 
    const [purchaseDates, setPurchaseDates] = useState([]); 

    useEffect(() => {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            console.error('No token found, redirecting to login...');
            navigate('/login');
            return;
        }

        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        setName(name); 
        setRole(role);

    }, [navigate]);

    // ดึงข้อมูลการขาย
    useEffect(() => {
        const fetchSalesData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("No auth token found, redirecting to login...");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/v1/sum/sales/all", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 403 || response.status === 401) {
                    console.error('Unauthorized or token expired, redirecting to login...');
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Sales Data:', data);

                // ดึงข้อมูลการขาย
                const extractedSalesData = data.map(item => item[1]); 
                const extractedSalesDates = data.map(item => item[0]); 
                
                setSalesData(extractedSalesData); 
                setSalesDates(extractedSalesDates); 
            } catch (error) {
                console.error("Error fetching sales data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch sales data. Please try again later.',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchSalesData();
    }, [navigate]);

    // ดึงข้อมูลการซื้อ
    useEffect(() => {
        const fetchPurchaseData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error("No auth token found, redirecting to login...");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("http://localhost:8080/api/v1/sum/invoice/all", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 403 || response.status === 401) {
                    console.error('Unauthorized or token expired, redirecting to login...');
                    navigate("/login");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Purchase Data:', data);

                // ดึงข้อมูลการซื้อ
                const extractedPurchaseData = data.map(item => item[1]); 
                const extractedPurchaseDates = data.map(item => item[0]); 
                
                setPurchaseData(extractedPurchaseData); 
                setPurchaseDates(extractedPurchaseDates); 
            } catch (error) {
                console.error("Error fetching purchase data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch purchase data. Please try again later.',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchPurchaseData();
    }, [navigate]);

    // ฟังก์ชัน logout
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('role');

        Swal.fire({
            icon: 'question',
            title: 'Log out',
            text: 'You want to log out?',
            confirmButtonText: 'Yes',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Log out',
                    text: 'Log out successful',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    navigate('/login');
                });
            }
        });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        Dashboard
                    </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Hello, {name}!
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a className="dropdown-item" href="#">
                                            Role: {role}
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="#" onClick={handleLogout}>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <h2>Dashboard</h2>
                <div className="row">
                    <div className="col-md-6">
                        <Graph salesData={salesData} dates={salesDates} label={"ยอดการขาย"} /> {/* กราฟข้อมูลการขาย */}
                    </div>
                    <div className="col-md-6">
                        <Graph salesData={purchaseData} dates={purchaseDates} label={"ยอดการซื้อ"} /> {/* กราฟข้อมูลการซื้อ */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
