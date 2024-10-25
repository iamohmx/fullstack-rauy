import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ฟังก์ชันดึงข้อมูลลูกค้าทั้งหมด
    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await fetch('http://localhost:8080/api/v1/customers/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }

            const data = await response.json();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // ฟังก์ชันเพิ่มลูกค้าใหม่
    const handleAddCustomer = () => {
        Swal.fire({
            title: 'Add New Customer',
            html: `
                <input id="name" class="swal2-input" placeholder="Name">
                <input id="email" class="swal2-input" placeholder="Email">
                <input id="phone" class="swal2-input" placeholder="Phone">
                <input id="address" class="swal2-input" placeholder="Address">
            `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;
                
                if(!name || !email || !phone || !address) {
                    Swal.showValidationMessage('All fields are required');
                    return false;
                }
                return { name, email, phone, address };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch('http://localhost:8080/api/v1/customers/add', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result.value),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to add customer');
                    }
                    Swal.fire('Added!', 'Customer has been added.', 'success');
                    fetchCustomers();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    // ฟังก์ชันอัปเดตข้อมูลลูกค้า
    const handleUpdateCustomer = (customer) => {
        Swal.fire({
            title: 'Update Customer',
            html: `
                <input id="name" class="swal2-input" placeholder="Name" value="${customer.name}">
                <input id="email" class="swal2-input" placeholder="Email" value="${customer.email}">
                <input id="phone" class="swal2-input" placeholder="Phone" value="${customer.phone}">
                <input id="address" class="swal2-input" placeholder="Address" value="${customer.address}">
            `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: () => {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const address = document.getElementById('address').value;

                if(!name || !email || !phone || !address) {
                    Swal.showValidationMessage('All fields are required');
                    return false;
                }

                return { name, email, phone, address };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:8080/api/v1/customers/updateCustomer/${customer.id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result.value),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to update customer');
                    }
                    Swal.fire('Updated!', 'Customer has been updated.', 'success');
                    fetchCustomers();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    // ฟังก์ชันลบข้อมูลลูกค้า
    const handleDeleteCustomer = (customerId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this customer?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:8080/api/v1/customers/deleteCustomer/${customerId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete customer');
                    }
                    Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
                    fetchCustomers();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // กำหนดคอลัมน์สำหรับตาราง
    const columns = [
        { name: 'Customer ID', selector: (row) => row.id, sortable: true },
        { name: 'Name', selector: (row) => row.name, sortable: true },
        { name: 'Email', selector: (row) => row.email, sortable: true },
        { name: 'Phone', selector: (row) => row.phone, sortable: true },
        { name: 'Address', selector: (row) => row.address, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button className="btn btn-warning btn-sm" onClick={() => handleUpdateCustomer(row)}>
                        <i className="bi bi-pencil-fill"></i>
                    </button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCustomer(row.id)}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            ),
            sortable: false,
        },
    ];

    return (
        <div className="container mt-4">
            <h1>Customer List</h1>
            <button className="btn btn-primary mb-3" onClick={handleAddCustomer}>
                Add Customer
            </button>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={customers}
                    pagination
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    highlightOnHover
                    striped
                />
            )}
        </div>
    );
};

export default Customer;
