import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useCart, useDispatchCart } from "../components/Contexred";
import aadio from "../statics/cart.mp3";

export default function Cart() {
  const [loading, setLoading] = useState(false);
  const data = useCart();
  const dispatch = useDispatchCart();

  const audio = new Audio();
  audio.src = aadio;

  if (data.length === 0) {
    return <div className="m-5 w-100 text-center fs-3">The Cart is Empty</div>;
  }

  const handleCheckOut = async () => {
    if (data.length === 0 || loading) {
      return;
    }

    try {
      let userEmail = localStorage.getItem("userEmail");
      let number = localStorage.getItem("phonenumber");
      let geoloc = localStorage.getItem("location");
      console.log(geoloc);
      setLoading(true);

      var currentDate = new Date();
      var options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };

      var formattedDate = currentDate.toLocaleString("en-US", options);

      let response = await fetch(
        `https://espacito-client.onrender.com/orderedData`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_data: data,
            email: userEmail,
            phonenumber: number,
            order_date: formattedDate,
            location: geoloc,
            Total_Price: totalPrice,
          }),
        }
      );

      console.log("JSON RESPONSE:::::", response.status);

      if (response.status === 200) {
        dispatch({ type: "DROP" });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  let totalPrice = data.reduce((total, food) => total + food.price, 0);

  return (
    <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
      <table className="table table-hover">
        <thead className="text-success fs-4">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Option</th>
            <th scope="col">Amount</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((food, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{food.name}</td>
              <td>{food.qntity}</td>
              <td>{food.size}</td>
              <td>{food.price}</td>
              <td>
                <button type="button" className="btn p-0">
                  <FaTrash
                    onClick={() => dispatch({ type: "REMOVE", index: index })}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h1 className="fs-2">Total Price: {totalPrice}/-</h1>
      </div>
      <div>
        <button
          className="btn bg-success mt-5"
          onClick={() => {
            handleCheckOut();
            audio.play();
          }}
        >
          {loading ? "Checking Out..." : "Check Out"}
        </button>
      </div>
    </div>
  );
}
