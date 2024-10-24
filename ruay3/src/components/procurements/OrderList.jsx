import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Navbar from "../dashboard/Navbar";

const OrderList = () => {
  const [invoices, setInvoices] = useState([]);
  const [goods, setGoods] = useState([]); 
  const [suppliers, setSuppliers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoicesGoodsAndSuppliers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No auth token found");
        }

        const invoicesResponse = await fetch("http://localhost:8080/api/v1/procurement/getAllInvoices", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!invoicesResponse.ok) {
          throw new Error(`Failed to fetch invoices: ${invoicesResponse.status}`);
        }
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData);

        const goodsResponse = await fetch("http://localhost:8080/api/v1/goods/getAllGoods", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!goodsResponse.ok) {
          throw new Error(`Failed to fetch goods: ${goodsResponse.status}`);
        }
        const goodsData = await goodsResponse.json();
        setGoods(goodsData);

        const suppliersResponse = await fetch("http://localhost:8080/api/v1/suppliers/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!suppliersResponse.ok) {
          throw new Error(`Failed to fetch suppliers: ${suppliersResponse.status}`);
        }
        const suppliersData = await suppliersResponse.json();
        setSuppliers(suppliersData);

        setLoading(false); 
      } catch (error) {
        console.error("Error:", error.message);
        setLoading(false); 
      }
    };

    fetchInvoicesGoodsAndSuppliers();
  }, []);

  const user = localStorage.getItem("name");
  const role = localStorage.getItem("role");
//   const getGoodNameById = (goodId) => {
//     const good = goods.find((g) => g.id === goodId); 
    
//     return good ? good.name : "Unknown Good";  
//   };

const getGoodNameById = (goodId) => {
    console.log("Received goodId:", goodId); // ตรวจสอบค่า goodId ที่ได้รับ

    console.log("Goods array:", goods); // ตรวจสอบรายการสินค้าที่อยู่ใน goods

    const good = goods.find((g) => g.id === goodId);  // ค้นหาสินค้าที่มี id ตรงกับ goodId

    if (good) {
        console.log("Found good:", good); // ตรวจสอบว่าสินค้าถูกค้นพบหรือไม่
    } else {
        console.log("Good not found for goodId:", goodId); // แสดงข้อความเมื่อหาไม่เจอ
    }

    return good ? good.name : "Unknown Good";  // คืนชื่อสินค้าหรือข้อความ "Unknown Good" ถ้าไม่เจอ
};


  const getSupplierNameById = (supId) => {
    const supplier = suppliers.find((supplier) => supplier.id === supId);
    return supplier ? supplier.name : "Unknown Supplier";
  };

  const formatDateToThai = (date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear() + 543;
    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status) => {
    if (status === "RECEIVED") {
      return "text-success"; 
    } else if (status === "ORDERED") {
      return "text-warning"; 
    }
    return ""; 
  };

  

  const handleChangeStatus = async (invoiceId) => {
    Swal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "Do you want to update the status to 'Received'?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("authToken");
  
          if (!token) {
            throw new Error("No auth token found");
          }
  
          const response = await fetch(`http://localhost:8080/api/v1/procurement/receiveGoods/${invoiceId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`, 
              "Content-Type": "application/json",
            },
          });
  
          // ตรวจสอบว่าคำตอบเป็น JSON หรือข้อความ
          const contentType = response.headers.get("content-type");
  
          let responseData;
          if (contentType && contentType.includes("application/json")) {
            responseData = await response.json(); // ถ้าคำตอบเป็น JSON
          } else {
            responseData = await response.text(); // ถ้าเป็นข้อความธรรมดา
          }
  
          if (!response.ok) {
            throw new Error(responseData); // ใช้ข้อความจาก response โดยตรง
          }
  
          Swal.fire({
            icon: "success",
            title: "Status Updated",
            text: "Goods status has been updated to 'Received'!",
            showConfirmButton: false,
            timer: 2000,
          });
  
          // อัปเดตสถานะใน UI
          setInvoices((prevInvoices) =>
            prevInvoices.map((invoice) =>
              invoice.id === invoiceId
                ? {
                    ...invoice,
                    status: "RECEIVED",
                    invoiceDetails: invoice.invoiceDetails.map((detail) => ({
                      ...detail,
                      status: 1, // เปลี่ยนสถานะของรายละเอียดใบแจ้งหนี้เป็น 'Received'
                    })),
                  }
                : invoice
            )
          );
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Failed to update status: ${error.message}`,
          });
        }
      }
    });
  };
  
  

  const handleViewDetails = (invoice) => {
    const invoiceDetailsHtml = invoice.invoiceDetails
      .map(
        (detail) => `
          <tr>
            <td>${getGoodNameById(detail.goodId)}</td> 
            <td>${detail.quantity}</td>
            <td>
            ${Intl.NumberFormat('th-TH', 
                { 
                    style: 'currency', 
                    currency: 'THB' 
                }).format(detail.amount)}
            </td>
            <td>${detail.status === 0 ? "Ordered" : "Received"}</td>
          </tr>`
      )
      .join("");

    Swal.fire({
      title: `Invoice ID: ${invoice.id}`,
      html: `
        <strong>Supplier:</strong> ${getSupplierNameById(invoice.supId)}<br>
        <strong>Date:</strong> ${formatDateToThai(invoice.date)}<br>
        <strong>Status:</strong> ${invoice.status}<br>
        <strong>Total:</strong> ${Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(invoice.total)}<br><br>
        <h6>Invoice Details:</h6>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Good Name</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceDetailsHtml}
          </tbody>
        </table>`,

      confirmButtonText: "Close",
    });
    };

  const columns = [
    {
      name: "Invoice ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Supplier",
      selector: (row) => getSupplierNameById(row.supId), 
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => formatDateToThai(row.date), // แปลงวันที่เป็น พ.ศ.
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span className={getStatusColor(row.status)}>{row.status}</span> 
      ),
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => `${Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(row.total)}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ minWidth: "220px" }}> 
          <button className="btn btn-primary btn-sm" onClick={() => handleViewDetails(row)}>
            View Details
          </button>
          &nbsp;
          <button
            className={`btn btn-sm ${row.status === "RECEIVED" ? "btn-success" : "btn-secondary"}`} 
            onClick={() => handleChangeStatus(row.id)} 
            disabled={row.status === "RECEIVED"} 
          >
            {row.status === "RECEIVED" ? "Received" : "Receive"}
          </button>
        </div>
      ),
      sortable: false,
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
    
    
        <Navbar name={user} role={role}/> 
        <div className="container mt-4">
        <h1>Order List</h1>
        <div className="row justify-content-center">
            <div className="col-md-10">
            {invoices.length === 0 ? (
                <p>No invoices found.</p>
            ) : (
                <DataTable
                columns={columns}
                data={invoices}
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                highlightOnHover
                striped
                />
            )}
            </div>
        </div>
        </div>
    </>
  );
};

export default OrderList;
