import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../dashboard/Navbar";

const OrderGoods = () => {
  const [supId, setSupId] = useState("");
  const [date, setDate] = useState("");
  const [total, setTotal] = useState(0);
  const [invoiceDetails, setInvoiceDetails] = useState([
    { goodId: "", quantity: 0, amount: 0 },
  ]);

  // State to hold suppliers and goods data
  const [suppliers, setSuppliers] = useState([]);
  const [goods, setGoods] = useState([]);

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No auth token found");
        }

        const response = await fetch(
          "http://localhost:8080/api/v1/suppliers/all",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch suppliers: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
          throw new Error("No data returned from API");
        }

        setSuppliers(data);
      } catch (error) {
        console.error("Failed to fetch suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // Fetch goods from API
  useEffect(() => {
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
          throw new Error(`Failed to fetch goods: ${response.status}`);
        }

        const data = await response.json();
        if (!data || data.length === 0) {
          throw new Error("No goods data returned from API");
        }

        setGoods(data);
      } catch (error) {
        console.error("Failed to fetch goods:", error);
      }
    };

    fetchGoods();
  }, []);

  // Handle adding more product lines
  const addProductLine = () => {
    setInvoiceDetails([
      ...invoiceDetails,
      { goodId: "", quantity: 0, amount: 0 },
    ]);
  };

  // Handle removing a product line
  const removeProductLine = (index) => {
    const updatedInvoiceDetails = invoiceDetails.filter(
      (detail, i) => i !== index
    );
    setInvoiceDetails(updatedInvoiceDetails);
    updateTotal();
  };

  // Handle input changes in each product line
  const handleProductLineChange = (index, field, value) => {
    const updatedInvoiceDetails = [...invoiceDetails];

    updatedInvoiceDetails[index][field] = value;

    if (field === "quantity" || field === "goodId") {
      const selectedGood = goods.find(
        (good) => good.id === parseInt(updatedInvoiceDetails[index].goodId)
      );

      if (selectedGood) {
        const quantity = parseFloat(updatedInvoiceDetails[index].quantity) || 0;
        updatedInvoiceDetails[index].amount = quantity * selectedGood.price;
      }
    }

    setInvoiceDetails(updatedInvoiceDetails);
    updateTotal();
  };

  // Update total amount
  const updateTotal = () => {
    const newTotal = invoiceDetails.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    setTotal(newTotal);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      supId,
      date,
      total,
      invoiceDetails: invoiceDetails.map((item) => ({
        goodId: parseInt(item.goodId),
        quantity: parseInt(item.quantity),
        amount: parseFloat(item.amount),
      })),
    };

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No auth token found");
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/procurement/createInvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      Swal.fire({
        icon: "success",
        title: "Invoice Created",
        text: "Invoice created successfully!",
        showConfirmButton: false,
        timer: 2000,
      });

      // Clear form after successful submission
      setSupId("");
      setDate("");
      setTotal(0);
      setInvoiceDetails([{ goodId: "", quantity: 0, amount: 0 }]);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const user = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  return (
    <>
      <Navbar name={user} role={role} />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1>Order Goods</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="supId" className="form-label">
                  Supplier
                </label>
                <select
                  className="form-select"
                  id="supId"
                  value={supId}
                  onChange={(e) => setSupId(e.target.value)}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <h4>Invoice Details</h4>
                {invoiceDetails.map((detail, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">
                      <div className="col">
                        <label
                          htmlFor={`goodId-${index}`}
                          className="form-label"
                        >
                          Good
                        </label>
                        <select
                          className="form-select"
                          id={`goodId-${index}`}
                          value={detail.goodId}
                          onChange={(e) =>
                            handleProductLineChange(index, "goodId", e.target.value)
                          }
                          required
                        >
                          <option value="">Select Good</option>
                          {goods.map((good) => (
                            <option key={good.id} value={good.id}>
                              {good.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col">
                        <label
                          htmlFor={`quantity-${index}`}
                          className="form-label"
                        >
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id={`quantity-${index}`}
                          value={detail.quantity}
                          onChange={(e) =>
                            handleProductLineChange(index, "quantity", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="col">
                        <label
                          htmlFor={`amount-${index}`}
                          className="form-label"
                        >
                          Amount
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id={`amount-${index}`}
                          value={detail.amount}
                          onChange={(e) =>
                            handleProductLineChange(index, "amount", e.target.value)
                          }
                          required
                          readOnly
                        />
                      </div>
                      <div className="col">
                        {/* Only show remove button if more than 1 product line */}
                        {invoiceDetails.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger mt-4"
                            onClick={() => removeProductLine(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addProductLine}
                >
                  Add Another Product
                </button>

                <div className="mb-3">
                  <label htmlFor="total" className="form-label">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="total"
                    value={total}
                    readOnly
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderGoods;
