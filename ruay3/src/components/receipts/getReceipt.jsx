import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

const GetReceipt = () => {
  const [receipts, setReceipts] = useState([]);
  const [goods, setGoods] = useState([]); // เก็บรายการสินค้าใน state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ฟังก์ชันดึงข้อมูลใบเสร็จจาก API
  const fetchReceipts = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/sales/getAllReceipts",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch receipts");
      }

      const data = await response.json();
      setReceipts(data); // เก็บข้อมูลใบเสร็จใน state
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  // ฟังก์ชันดึงข้อมูลสินค้า
  const fetchGoods = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/goods/getAllGoods",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

  useEffect(() => {
    fetchGoods();
    fetchReceipts();
  }, []);

  

  const getGoodNameById = (goodId) => {
    console.log("Received goodId:", goodId); // ตรวจสอบค่า goodId ที่ได้รับ

    console.log("Goods array:", goods); // ตรวจสอบรายการสินค้าที่อยู่ใน goods

    const good = goods.find((g) => g.id === goodId); // ค้นหาสินค้าที่มี id ตรงกับ goodId

    if (good) {
      console.log("Found good:", good); // ตรวจสอบว่าสินค้าถูกค้นพบหรือไม่
    } else {
      console.log("Good not found for goodId:", goodId); // แสดงข้อความเมื่อหาไม่เจอ
    }

    return good ? good.name : "Unknown Good"; // คืนชื่อสินค้าหรือข้อความ "Unknown Good" ถ้าไม่เจอ
  };

  const formatDateToThai = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  };

  // ฟังก์ชันแสดงรายละเอียดใบเสร็จด้วย Swal
  const handleViewDetails = (receipt) => {
    const detailsHtml = receipt.receiptDetails
      .map(
        (detail) => `
          <tr>
            <td>${detail.goodId}</td>
            <td>${getGoodNameById(detail.goodId)}</td>
            <td>${detail.quantity}</td>
            <td>${Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
            }).format(detail.amount)}</td>
          </tr>`
      )
      .join("");

    Swal.fire({
      title: `Receipt ID: ${receipt.id}`,
      html: `
        <strong>Date:</strong> ${formatDateToThai(receipt.date)}<br>
        <strong>Customer:</strong> ${receipt.cust}<br>
        <strong>Total:</strong> ${Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
        }).format(receipt.total)}<br><br>
        <h6>Receipt Details:</h6>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Good ID</th>
              <th>Good Name</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${detailsHtml}
          </tbody>
        </table>
      `,
      confirmButtonText: "Close",
    });
  };

  const columns = [
    { name: "Receipt ID", selector: (row) => row.id, sortable: true },
    { name: "Date", selector: (row) => formatDateToThai(row.date), sortable: true },
    { name: "Customer", selector: (row) => row.cust, sortable: true },
    {
      name: "Total",
      selector: (row) =>
        `${Intl.NumberFormat("th-TH", {
          style: "currency",
          currency: "THB",
        }).format(row.total)}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleViewDetails(row)}
        >
          View Details
        </button>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h1>Receipts List</h1>
      <DataTable
        columns={columns}
        data={receipts}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        highlightOnHover
        striped
      />
    </div>
  );
};

export default GetReceipt;
