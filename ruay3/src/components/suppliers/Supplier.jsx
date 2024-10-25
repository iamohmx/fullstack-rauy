import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import Navbar from '../dashboard/Navbar';

const Supplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ฟังก์ชันดึงข้อมูลผู้จัดจำหน่าย
    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No auth token found');
            }

            const response = await fetch('http://localhost:8080/api/v1/suppliers/all', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }

            const data = await response.json();
            setSuppliers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // ฟังก์ชันเพิ่มผู้จัดจำหน่ายใหม่
    const handleAddSupplier = () => {
        Swal.fire({
            title: 'Add New Supplier',
            html: `
                <input id="name" class="swal2-input" placeholder="Name">
                <input id="address" class="swal2-input" placeholder="Address">
                <input id="phone" class="swal2-input" placeholder="Phone">
                <input id="email" class="swal2-input" placeholder="Email">
            `,
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: () => {
                const name = document.getElementById('name').value.trim();
                const address = document.getElementById('address').value.trim();
                const phone = document.getElementById('phone').value.trim();
                const email = document.getElementById('email').value.trim();
    
                if (!name || !address || !phone || !email) {
                    Swal.showValidationMessage('All fields are required');
                    return false; // หยุดการส่งข้อมูลถ้ามีฟิลด์ว่าง
                }
    
                return { name, address, phone, email };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch('http://localhost:8080/api/v1/suppliers/add', {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result.value),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to add supplier');
                    }
                    Swal.fire('Added!', 'Supplier has been added.', 'success');
                    fetchSuppliers();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };
    

    // ฟังก์ชันอัปเดตผู้จัดจำหน่าย
    const handleUpdateSupplier = (supplier) => {
        Swal.fire({
            title: 'Update Supplier',
            html: `
                <input id="name" class="swal2-input" placeholder="Name" value="${supplier.name}">
                <input id="address" class="swal2-input" placeholder="Address" value="${supplier.address}">
                <input id="phone" class="swal2-input" placeholder="Phone" value="${supplier.phone}">
                <input id="email" class="swal2-input" placeholder="Email" value="${supplier.email}">
            `,
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: () => {
                const name = document.getElementById('name').value;
                const address = document.getElementById('address').value;
                const phone = document.getElementById('phone').value;
                const email = document.getElementById('email').value;

                if (!name || !address || !phone || !email) {
                    Swal.showValidationMessage('All fields are required');
                    return false;
                }
                return { name, address, phone, email };
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:8080/api/v1/suppliers/updateSupplier/${supplier.id}`, {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(result.value),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to update supplier');
                    }
                    Swal.fire('Updated!', 'Supplier has been updated.', 'success');
                    fetchSuppliers();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    // ฟังก์ชันลบผู้จัดจำหน่าย
    const handleDeleteSupplier = (supplierId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this supplier?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await fetch(`http://localhost:8080/api/v1/suppliers/deleteSupplier/${supplierId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete supplier');
                    }
                    Swal.fire('Deleted!', 'Supplier has been deleted.', 'success');
                    fetchSuppliers();
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // กำหนดคอลัมน์สำหรับตาราง
    const columns = [
        { name: 'Supplier ID', selector: (row) => row.id, sortable: true },
        { name: 'Name', selector: (row) => row.name, sortable: true },
        { name: 'Address', selector: (row) => row.address, sortable: true },
        { name: 'Phone', selector: (row) => row.phone, sortable: true },
        { name: 'Email', selector: (row) => row.email, sortable: true },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button className="btn btn-warning btn-sm" onClick={() => handleUpdateSupplier(row)}>
                        <i className="bi bi-pencil-fill"></i>
                    </button>{' '}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSupplier(row.id)}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>
            ),
            sortable: false,
        },
    ];
    const name = localStorage.getItem('name')
    const role = localStorage.getItem('role')
    return (
        <>
            <Navbar name={name} role={role}/>
            <div className="container mt-4">
                <h1>Supplier List</h1>
                <button className="btn btn-primary mb-3" onClick={handleAddSupplier}>
                    Add Supplier
                </button>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <DataTable
                        columns={columns}
                        data={suppliers}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                        highlightOnHover
                        striped
                    />
                )}
            </div>
        </>
    );
};

export default Supplier;
