import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../statics/loginbg.jpg";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/loginuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (!response.ok) {
        alert("email or password wrong");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!json.success) {
        console.log("Enter Valid Details");
      }
      if (json.success) {
        console.log("success");
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authtoken);
        localStorage.setItem("phonenumber",json.number);
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
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="row container ">
          <div className="col-md-4">
            <form onSubmit={handleSubmit}>
              <div className="m-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label fs-4 text-dark"
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
              </div>
              <div className="m-3">
                <label
                  htmlFor="exampleInputPassword1"
                  className="form-label fs-4 text-dark"
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
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
              <Link to="/createuser" className="m-3 btn btn-success">
                New User
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
