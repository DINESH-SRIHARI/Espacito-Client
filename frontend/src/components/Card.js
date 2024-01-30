// Card.js
import React, { useEffect, useRef, useState } from "react";
import { useCart, useDispatchCart } from "./Contexred";
import { Link } from "react-router-dom";
import click from '../statics/clicksound.mp3'
const Card = (props) => {
  let dispatch = useDispatchCart();
  let data = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("regular");
  const priceRef = useRef();
  const [TotalPrice, setTotalPrice] = useState(qty * parseInt(props.allitem.regular));
  const [showToast, setShowToast] = useState(false);
  const [showToastUpdated, setShowToastUpdated] = useState(false);
  const audio = new Audio();
  audio.src = click;  // Corrected line
  const handleAddtocard = async () => {
    let food = {};
    for (const item of data) {
      if (item.id === props.allitem._id) {
        food = item;
        break;
      }
    }

    if (Object.keys(food).length !== 0) {
      if (food.size === size) {
        setShowToastUpdated(true);
        setTimeout(() => setShowToastUpdated(false), 3000);
        await dispatch({ type: "UPDATE", id: props.allitem._id, price: TotalPrice, qntity: qty });
        return;
      } else if (food.size !== size) {
        setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
        await dispatch({ type: "ADD", id: props.allitem._id, name: props.allitem.name, price: TotalPrice, qntity: qty, size: size, img: props.ImgSrc });
        console.log("Size different, so simply ADD one more to the list");
        return;
      }
      return;
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    await dispatch({ type: "ADD", id: props.allitem._id, name: props.allitem.name, price: TotalPrice, qntity: qty, size: size, img: props.allitem.img });
    console.log(data);
  };

  useEffect(() => {
    setSize(priceRef.current.value);
    setTotalPrice(qty * parseInt(props.allitem[size]));
  }, [qty, size, props.allitem]);
  return (
    <div className="card m-2 border border-warning p-1 position-relative" style={{ width: "22rem", maxHeight: "500px", overflowY: "auto" }}>
      <img src={props.allitem.img} className="card-img-top rounded" alt="..." style={{ borderRadius: "10px" }} />
      <div className="card-body">
        <h5 className="card-title">{props.allitem.name}</h5>
        <p className="card-text">{props.allitem.description}</p>
        <div className="container w-100">
          <select className="m-2 h-100 bg-warning" onChange={(e) => setQty(e.target.value)}>
            {Array.from(Array(6), (e, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select className="m-2 h-100 bg-warning" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
            <option value="regular">Regular</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <div className="d-inline h-100 fs-5">₹{TotalPrice}</div>
        </div>
        <hr />
        {localStorage.getItem("authToken") ? (
          <button className="btn bg-warning" onClick={()=>{handleAddtocard() ;audio.play();}}>
          Add to Cart
        </button>
        ) : (
      <Link
      to="/login"
      className="btn bg-warning hoverbtn"
    >
      Login to Add to Cart
    </Link>)}
        
      </div>

      {/* Toast notification */}
      <div
        className={`toast align-items-center position-absolute top-0 end-0${showToast ? " show" : ""}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 1 }}
      >
        <div className="d-flex">
          <div className="toast-body text-success">Added successfully</div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      </div>

      {/* Toast notification updated */}
      <div
        className={`toast align-items-center position-absolute top-0 end-0${showToastUpdated ? " show" : ""}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 1 }}
      >
        <div className="d-flex">
          <div className="toast-body text-success">Updated successfully</div>
          <button
            type="button"
            className="btn-close me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => setShowToastUpdated(false)}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Card;
