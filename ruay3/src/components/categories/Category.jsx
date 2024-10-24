import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import Navbar from '../dashboard/Navbar';

// API base URL
const apiUrl = 'http://localhost:8080/api/v1/category';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('authToken'); // Fetch token from localStorage
            if (!token) {
                throw new Error('No auth token found');
            }
            const response = await fetch(`${apiUrl}/getAllCategories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add category
    const handleAddCategory = () => {
        Swal.fire({
            title: 'Add New Category',
            input: 'text',
            inputLabel: 'Category Name',
            inputPlaceholder: 'Enter category name',
            showCancelButton: true,
            confirmButtonText: 'Add',
            preConfirm: (categoryName) => {
                if (!categoryName) {
                    Swal.showValidationMessage('Please enter a category name');
                }
                return categoryName;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const newCategory = { name: result.value };
                const token = localStorage.getItem('authToken'); // Fetch token

                try {
                    const response = await fetch(`${apiUrl}/add`, {
                        method: 'POST',
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify(newCategory)
                    });
                    if (response.ok) {
                        const createdCategory = await response.json();
                        setCategories([...categories, createdCategory]);
                        Swal.fire('Added!', 'Category has been added.', 'success');
                        fetchCategories(); // Refresh categories
                    } else {
                        Swal.fire('Error!', 'Unable to add category.', 'error');
                    }
                } catch (error) {
                    console.error('Error adding category:', error);
                }
            }
        });
    };

    // Update category
    const handleEditCategory = (category) => {
        Swal.fire({
            title: 'Edit Category',
            input: 'text',
            inputLabel: 'Category Name',
            inputValue: category.name,
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: (newCategoryName) => {
                if (!newCategoryName) {
                    Swal.showValidationMessage('Please enter a category name');
                }
                return newCategoryName;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('authToken'); // Fetch token
                try {
                    const updatedCategory = { id: category.id, name: result.value };
                    const response = await fetch(`${apiUrl}/updateCategory/${category.id}`, {
                        method: 'PUT',
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify(updatedCategory)
                    });

                    if (response.ok) {
                        const updatedCategories = categories.map((cat) =>
                            cat.id === category.id ? { ...cat, name: result.value } : cat
                        );
                        setCategories(updatedCategories);
                        Swal.fire('Updated!', 'Category has been updated.', 'success');
                    } else {
                        Swal.fire('Error!', 'Unable to update category.', 'error');
                    }
                } catch (error) {
                    console.error('Error updating category:', error);
                }
            }
        });
    };

    // Delete category
    const handleDeleteCategory = (categoryId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem('authToken'); // Fetch token
                try {
                    const response = await fetch(`${apiUrl}/deleteCategory/${categoryId}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
                        setCategories(updatedCategories);
                        Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                    } else {
                        Swal.fire('Error!', 'Unable to delete category.', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting category:', error);
                }
            }
        });
    };

    // DataTable columns
    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true
        },
        {
            name: 'Category Name',
            selector: (row) => row.name,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div>
                    <button onClick={() => handleEditCategory(row)} className="btn btn-warning btn-sm">
                        <i className="bi bi-pencil-fill"></i> 
                    </button>
                    &nbsp;
                    <button onClick={() => handleDeleteCategory(row.id)} className="btn btn-danger btn-sm">
                        <i className='bi bi-trash-fill'></i>
                    </button>
                </div>
            )
        }
    ];
    
  const user = localStorage.getItem("name");
  const role = localStorage.getItem("role");

    return (
        <>
            <Navbar name={user} role={role} />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <h1>Category Management</h1>
                        <button onClick={handleAddCategory} className="btn btn-primary mb-3">
                            Add Category
                        </button>
                        <DataTable
                            title="Categories"
                            columns={columns}
                            data={categories.map((category, index) => ({ ...category, uniqueKey: `${category.id}-${index}` }))} // Ensuring unique key
                            keyField="uniqueKey" // Using the uniqueKey as the key
                            progressPending={isLoading}
                            pagination
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Category;
