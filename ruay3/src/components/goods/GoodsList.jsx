import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

const GoodsList = () => {
  const [goods, setGoods] = useState([]); // เก็บรายการสินค้าใน state
  const [categories, setCategories] = useState([]); // เก็บรายการหมวดหมู่ใน state
  const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
  const [error, setError] = useState(null); // เก็บข้อผิดพลาดถ้ามี

  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchGoods = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch("http://localhost:8080/api/v1/goods/getAllGoods", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch goods");
      }

      const data = await response.json();
      setGoods(data); // เก็บข้อมูลใน state
      setLoading(false); // ปิดสถานะการโหลด
    } catch (error) {
      setError(error.message); // เก็บข้อความข้อผิดพลาด
      setLoading(false); // ปิดสถานะการโหลด
    }
  };

  // ฟังก์ชันดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8080/api/v1/category/getAllCategories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data); // เก็บข้อมูลหมวดหมู่ใน state
    } catch (error) {
      console.error("Failed to fetch categories:", error.message);
    }
  };

  // ฟังก์ชันสำหรับอัปเดตสินค้า
  const handleUpdate = (good) => {
    Swal.fire({
      title: "Update Product",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Name" value="${good.name}">
        <input id="swal-input2" class="swal2-input" placeholder="Price" type="number" value="${good.price}">
        <input id="swal-input3" class="swal2-input" placeholder="Quantity" type="number" value="${good.quantity}">
        <input id="swal-input5" class="swal2-input" placeholder="Image URL" value="${good.image}">
        <select id="swal-input4" class="swal2-input">
          ${categories.map((category) => `<option value="${category.id}" ${category.id === good.category.id ? 'selected' : ''}>${category.name}</option>`).join('')}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const name = document.getElementById("swal-input1").value;
        const price = document.getElementById("swal-input2").value;
        const quantity = document.getElementById("swal-input3").value;
        const image = document.getElementById("swal-input5").value;
        const categoryId = document.getElementById("swal-input4").value;
        console.log("Category ID:", categoryId);
        
        return { name, price, quantity, image, category: { id: categoryId } };
      },
      
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { name, price, quantity, image, category: { id: categoryId }} = result.value;
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:8080/api/v1/goods/updateGoods/${good.id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, price, quantity, image, category: { id: categoryId }}),
          });
  
          if (!response.ok) {
            throw new Error("Failed to update product");
          }
          Swal.fire("Updated!", "Product has been updated.", "success");
          fetchGoods(); // ดึงข้อมูลใหม่หลังจากอัปเดต
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };
  
  // ฟังก์ชันสำหรับลบสินค้า
  const handleDelete = (goodId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:8080/api/v1/goods/deleteGoods/${goodId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error("Failed to delete product");
          }
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          fetchGoods(); // ดึงข้อมูลใหม่หลังจากลบ
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  // ดึงข้อมูลเมื่อ component ถูก mount
  useEffect(() => {
    fetchGoods();
    fetchCategories(); // ดึงข้อมูลหมวดหมู่
  }, []);

  // กำหนดคอลัมน์สำหรับตาราง
  const columns = [
    {
      name: "Image",
      selector: (row) => <img src={row.image} alt={row.name} style={{ width: "50px", height: "50px" }} />, // แสดงรูปภาพขนาดเล็ก
      sortable: false,
    },
    {
      name: "Good ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Good Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) =>
        `${Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(row.price)}`,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category.name, // แสดงชื่อหมวดหมู่
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="btn btn-warning btn-sm" onClick={() => handleUpdate(row)}>
            <i className="bi bi-pencil-fill"></i>
          </button>{" "}
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.id)}>
            <i className="bi bi-trash-fill"></i>
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  // แสดงข้อมูลใน DataTable
  return (
    <>
      <div className="container mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <DataTable
            columns={columns}
            data={goods}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20]}
            highlightOnHover
            striped
          />
        )}
      </div>
      <hr />
    </>
  );
};

export default GoodsList;
