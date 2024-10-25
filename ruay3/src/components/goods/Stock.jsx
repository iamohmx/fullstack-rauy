import { useEffect, useState } from 'react';

const Stock = () => {
    const [stock, setStock] = useState(0);

    const fetchStock = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await fetch('http://localhost:8080/api/v1/sum/stock', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stock');
            }

            const data = await response.json();
            setStock(data.totalStock); // ดึงค่า totalStock
            fetchStock()
        } catch (error) {
            console.error('Failed to fetch stock:', error.message);
        }
    };

    useEffect(() => {
        fetchStock();
    }, []);

    return (
        <>
            <h2 className='float-end'>Total Stock: {stock}</h2>
        </>
    );
};

export default Stock;
