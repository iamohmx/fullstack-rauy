import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import Graph from './Graph';
import Navbar from './Navbar';
// import GoodsList from '../goods/GoodsList';
import GetReceipt from '../receipts/getReceipt';
import Stock from '../goods/Stock';

const Dashboard = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    
    const [salesData, setSalesData] = useState([]); 
    const [salesDates, setSalesDates] = useState([]); 
    const [purchaseData, setPurchaseData] = useState([]); 
    const [purchaseDates, setPurchaseDates] = useState([]); 

    const checkAuthToken = useCallback(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return false;
        }
        return token;
    }, [navigate]);

    const fetchData = useCallback(async (url, setData, setDates, dataType) => {
        const token = checkAuthToken();
        if (!token) return;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 403 || response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            const extractedData = data.map(item => item[1]);
            const extractedDates = data.map(item => item[0]);
            
            setData(extractedData); 
            setDates(extractedDates); 
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to fetch ${dataType} data.`,
                confirmButtonText: 'OK'
            });
            console.log(error);
            
        }
    }, [checkAuthToken, navigate]);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        const storedRole = localStorage.getItem('role');
        setName(storedName); 
        setRole(storedRole);

        fetchData("http://localhost:8080/api/v1/sum/sales/all", setSalesData, setSalesDates, 'sales');
        fetchData("http://localhost:8080/api/v1/sum/invoice/all", setPurchaseData, setPurchaseDates, 'purchase');
    }, [fetchData]);

    return (
        <>
            <Navbar name={name} role={role} />
            <div className="container mt-5">
                <h2>Dashboard</h2>
                <div className="row justify-content-end">
                    <div className="col-md-12">
                        <Stock  />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-md-6 mb-4">
                        <Graph salesData={salesData} dates={salesDates} label={"Sales Data"} />
                    </div>
                    <div className="col-6 col-md-6 mb-4">
                        <Graph salesData={purchaseData} dates={purchaseDates} label={"Purchase Data"} />
                    </div>
                </div>
                <hr />
                <div className="row">
                    {/* <div className="col-md-12">
                        <h2>Goods List</h2>
                        <GoodsList />
                    </div> */}
                    <div className="col-md-12">
                        <GetReceipt />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;