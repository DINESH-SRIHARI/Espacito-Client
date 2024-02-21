import React, { useState, useEffect } from "react";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

  const fetchMyOrder = async () => {
    try {
      const response = await fetch(
        
        `https://espacito-client.onrender.com/myorderedData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("userEmail"),
          }),
        }
      );

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
      <div></div>
      {orderData.length > 0 && (
        <div>
          {orderData.reverse().map((tempdata, index) => (
            <div key={index} className="text-center mb-4">
              <div className="d-flex justify-content-center text-center mt-3">
                <h2 className=" ">{tempdata[0].Order_date}</h2>
                <h3 className="text-success mx-3">{tempdata[0].status}</h3>
              </div>
              <hr />

              <h4 className="mb-3">
                <span className="text-warning">Order_Id:</span>
                {tempdata[0].Order_Id}
              </h4>
              <h4 className="mb-3">
                <span className="text-warning">TotalPrice:</span>₹
                {tempdata[0].Total_price}
              </h4>
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {tempdata
                  .filter((item, j) => j !== 0)
                  .map((item, j) => (
                    <div
                      key={j}
                      className="card m-2"
                      style={{ width: "20rem" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title text-warning">{item.name}</h5>
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
