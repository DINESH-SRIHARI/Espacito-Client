import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../statics/loginbg.jpg";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loader, setloader] = useState(false);
  const [eyepass, seteyepass] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("phonenumber")) {
      navigate("/");
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true);
    try {
      const response = await fetch(
        `https://espacito-client.onrender.com
/loginuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        }
      );
      const json = await response.json();
      setloader(false);
      if (!response.ok) {
        alert("Enter the valid Email and Password");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!json.success) {
        console.log("Enter Valid Details");
      }
      if (json.success) {
        console.log("success");
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authtoken);
        localStorage.setItem("phonenumber", json.number);
        localStorage.setItem("location", json.loc);
        localStorage.setItem("uid", json.uid);
        console.log(json.loc);
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
      {loader ? <span class="loader"></span> : ""}
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
            <form>
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
                <div className="d-flex">
                  <input
                    type={eyepass ? "text" : "password"}
                    className="form-control"
                    id="exampleInputPassword1"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                  <button
                    className="btn"
                    style={{ marginLeft: "-50px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      seteyepass(!eyepass);
                    }}
                  >
                    {eyepass ? "👀" : "👁️"}
                  </button>
                </div>
                <div className="mt-2 fs-4">
                  <Link to={"/forgetpassword"}>Forgotten password?</Link>
                </div>
              </div>

              <button onClick={handleSubmit} className="btn btn-primary">
                Login {loader ? <span class="loader2"></span> : ""}
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
