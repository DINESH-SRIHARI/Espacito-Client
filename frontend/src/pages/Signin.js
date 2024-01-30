import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import backgroungsign from "../statics/signin.jpg";
import sigin from "../css/sigin.css";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "", // Updated field name for phone number
    email: "",
    password: "",
    geolocation: "",
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: credentials.name,
          phone: credentials.phone, // Updated field name for phone number
          email: credentials.email,
          password: credentials.password,
          geolocation: credentials.geolocation,
        }),
      });

      if (!response.ok) {
        alert("There is some error. Please check it");
        console.log(response);
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        alert("New User Added Successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="justify-content-center all">
      <div
        className="row container mx-5"
        style={{
          backgroundImage: `url(${backgroungsign})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="col-md-4 ">
          <form onSubmit={handleSubmit}>
            <div className="m-3">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-dark"
              >
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="name"
                value={credentials.name}
                onChange={handleChange}
              />
            </div>
            <div className="m-3">
              <label
                htmlFor="exampleInputPhone"
                className="form-label text-dark"
              >
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputPhone"
                aria-describedby="emailHelp"
                name="phone" // Updated field name for phone number
                value={credentials.phone} // Updated field name for phone number
                onChange={handleChange}
              />
            </div>
            <div className="m-3">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-dark"
              >
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="email"
                value={credentials.email}
                onChange={handleChange}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="m-3">
              <label
                htmlFor="exampleInputPassword1"
                className="form-label text-dark"
              >
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                name="password"
                value={credentials.password}
                onChange={handleChange}
              />
              <div id="emailHelp" className="form-text">
                The Password Must Be A Minimum of 5 letters
              </div>
            </div>
            <div className="m-3">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-dark"
              >
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                name="geolocation"
                value={credentials.geolocation}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <Link to="/login" className="m-3 btn btn-danger">
              Already User
            </Link>
          </form>
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.666388229474!2d78.29956607401381!3d16.492421827972063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bca6b6c7872f279%3A0x8ef010553128947f!2sESPOSITO!5e0!3m2!1sen!2sin!4v1704442933382!5m2!1sen!2sin"
        style={{ border: 0, margin: "20px auto" }}
        width="auto"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
