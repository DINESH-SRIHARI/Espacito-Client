import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroungsign from "../statics/signin.jpg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  const [loader, setLoader] = useState(false);
  const [phone, setPhone] = useState("");
  const recaptchaRef = useRef(null);
  let navigate = useNavigate();
  const id = localStorage.getItem("uid");
  const fetchUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `${latitude},${longitude}`;
          setCredentials({ ...credentials, geolocation: location });
        },
        (error) => {
          console.error("Error getting user location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://espacito-client.onrender.com/getalldata/${id}`
        );
        setCredentials(response.data);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    fetchUserLocation();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await fetch(
        `https://espacito-client.onrender.com/update/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            location: credentials.geolocation,
          }),
        }
      );
      console.log(response);
      if (!response.ok) {
        alert("There is some error. Please check it");
        console.log(response);
        setLoader(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        alert("Details Updated Sucessfully");
        setLoader(false);
        navigate("/");
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
          <form>
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

              <div className="d-flex">
                <PhoneInput
                  disabled
                  style={{
                    backgroundColor: "#22252b",
                    boxSizing: "border-box",
                    borderRadius: "5px",
                  }}
                  inputStyle={{
                    backgroundColor: "#22252b",
                    color: "white",
                    outline: "none",
                    border: "none",
                  }}
                  dropdownStyle={{ backgroundColor: "black", color: "white" }}
                  country={"in"}
                  value={phone}
                  onChange={(value) => setPhone(value)}
                />
                <div ref={recaptchaRef}></div>
              </div>
            </div>
            <div className="m-3">
              <label
                htmlFor="exampleInputEmail1"
                className="form-label text-dark"
              >
                Email address
              </label>
              <input
                disabled={true}
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
              <div className="d-flex">
                <input
                  disabled={true}
                  type={"password"}
                  className="form-control"
                  id="exampleInputPassword1"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-success"
                  style={{ marginLeft: "-50px", fontSize: "12px" }}
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    navigate("/forgetpassword");
                  }}
                >
                  update password
                </button>
              </div>
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
            <button onClick={handleSubmit} className="btn btn-primary">
              Update Details{loader ? <span className="loader2"></span> : ""}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
