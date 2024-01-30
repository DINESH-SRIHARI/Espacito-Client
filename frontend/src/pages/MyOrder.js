import React, { useState, useEffect } from "react";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/myorderedData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
        }),
      });

      const data = await response.json();
      console.log("this");
      setOrderData(data.Orderdata.orderdata || []);
    } catch (error) {
      console.error("Error fetching my order:", error);
    }
  };

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center flex-wrap">
      <div>
        <h1 className="text-success fst-italic mb-2">
          Every Order Will Be Placed With in 30 min
        </h1>
      </div>
      {orderData.length > 0 && (
        <div>
          {orderData.reverse().map((tempdata, index) => (
            <div key={index} className="text-center mb-4">
              <div className="d-flex justify-content-center">
                <h2 className="mb-3">{tempdata[0].Order_date}</h2>
                <button type="button" class="btn btn-outline-info mx-3 ">
                  {" "}
                  {tempdata[0].status}
                </button>
              </div>
              <hr />
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {tempdata
                  .filter((item, j) => j !== 0)
                  .map((item, j) => (
                    <div
                      key={j}
                      className="card m-2"
                      style={{ width: "18rem" }}
                    >
                      <img
                        src={item.img}
                        className="card-img-top"
                        style={{ width: "100%" }}
                        alt={item.name}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text">
                          Price: ₹{item.price}/- | Quantity: {item.qntity} |
                          Size: {item.size}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
