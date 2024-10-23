import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Goods = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]); // State for shopping cart
  const [customerName, setCustomerName] = useState(""); // State for customer name

  // Fetch goods from the API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/goods/getAllGoods"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to cart or update quantity
  const handleBuyNow = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantityInCart: item.quantityInCart + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantityInCart: 1 }];
      }
    });
  };

  // Function to increase quantity
  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantityInCart: item.quantityInCart + 1 }
          : item
      )
    );
  };

  // Function to decrease quantity
  const decreaseQuantity = (productId) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) =>
            item.id === productId
              ? { ...item, quantityInCart: item.quantityInCart - 1 }
              : item
          )
          .filter((item) => item.quantityInCart > 0) // Remove item from cart if quantityInCart is 0
    );
  };

  // Calculate total amount
  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantityInCart,
      0
    );
  };

  // Handle checkout: Send cart data to backend and update product quantities
const handleCheckout = async () => {
  const payload = {
    cust: customerName || "Customer", // Customer's name
    date: new Date().toString(), // Current date
    total: calculateTotal(),
    receiptDetails: cart.map((item) => ({
      goodId: item.id,
      quantity: item.quantityInCart,
      amount: item.price * item.quantityInCart,
    })),
  };

  // Confirm the checkout with a SweetAlert2 modal
  Swal.fire({
    title: "สั่งซื้อสินค้า",
    text: "ต้องการสั่งซื้อสินค้าหรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost:8080/api/v1/sales/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to submit the order");
        }

        // Update the quantities of the products in the database
        await updateProductQuantities();

        Swal.fire({
          title: "Order Submitted",
          text: "Your order has been submitted successfully!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          setCart([]);
          setCustomerName(""); // Clear the cart after successful submission
        });
      } catch (error) {
        Swal.fire({
          title: "Order Failed",
          text: `Error: ${error.message}`,
          icon: "error",
          timer: 2000,
        });
      }
    }
  });
};


  // Function to update product quantities after checkout
  const updateProductQuantities = async () => {
    try {
      for (const item of cart) {
        // For each product in the cart, update the product quantity in the backend
        await fetch(
          `http://localhost:8080/api/v1/goods/updateQuantity/${item.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: item.quantity - item.quantityInCart, // Update quantity in the database
            }),
          }
        );
      }

      // Re-fetch the updated products list after the order is processed
      fetchProducts();
    } catch (error) {
      console.error("Error updating product quantities:", error);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">ร้านรวยๆๆๆ</h1>
      <div className="row">
        <div className="col-md-9">
          {/* Product Listings */}
          <div className="row">
            {products.map((product) => (
              <div key={product.id} className="col-md-3">
                <div className="card h-100">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">฿ {product.price.toFixed(2)} บาท</p>
                    {/* { product.quantity === 0 &&  className="text-danger" } */}
                    <p className={product.quantity === 0 ? "text-danger" : ""}>
                      จำนวนสินค้า: {product.quantity} ชิ้น
                    </p>
                    {/* Hide Buy Now button if the product is out of stock */}
                    {product.quantity > 0 ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleBuyNow(product)}
                      >
                        Buy Now
                      </button>
                    ) : (
                      <button className="btn btn-secondary" disabled>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-3">
          {/* Shopping Cart */}
          <div className="mb-4">
            <h4>รายการสินค้า</h4>
            {/* Input for customer name */}
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            {cart.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              <ul className="list-group">
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.name} &nbsp;
                      <div className="btn-group mt-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        &nbsp;
                        {item.quantityInCart}
                        &nbsp;
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span>
                      ฿{(item.price * item.quantityInCart).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            ราคารวม : ฿{" "}
            {cart
              .reduce((acc, item) => acc + item.price * item.quantityInCart, 0)
              .toFixed(2)}{" "}
            บาท
          </div>

          {/* Checkout Button */}
          {cart.length > 0 && (
            <button className="btn btn-success" onClick={handleCheckout}>
              สั่งซื้อสินค้า
            </button>
          )}
        </div>
        </div>
          <div className="py-2"></div>
      {/* Footer */}
      <div className="container mt-5">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <a
              href="/"
              className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
            >
              <svg className="bi" width="30" height="24">
              </svg>
            </a>
            <span className="mb-3 mb-md-0 text-body-secondary">
              © {new Date().getFullYear()} Ruay3n, Inc
            </span>
          </div>

          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="ms-3">
                <Link to="/login" className="text-dark fs-4">
                    <i className="bi bi-gear-wide-connected"></i>
                </Link>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
};

export default Goods;
