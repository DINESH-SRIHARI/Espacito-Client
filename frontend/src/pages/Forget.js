import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../statics/loginbg.jpg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/setup";

const Forget = () => {
  const [otp, setOtp] = useState(false);
  const [otpin, setOtpin] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setuser] = useState(null);
  const [verified, setVerified] = useState(false);
  const recaptchaRef = useRef(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loader, setloader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloader(true);
    console.log("+"+phone+" "+credentials.password)
    try {
      const response = await fetch(`http://localhost:5000/updatepass`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Phone: "+"+phone,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      setloader(false);
      if (!response.ok) {
        alert("email or password wrong");
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!json.success) {
        console.log("Enter Valid Details");
      }
      if (json.success) {
        console.log("success");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleVerification = async () => {
    
    try {
      const response = await fetch(`http://localhost:5000/checkphone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone:"+" +phone,
        }),
      });
      
      if (response.ok) {
       
        const data = await response.text(); 
        if (data === "Valid Number") {
            setOtp(true);
         
          try {
            const recaptchaVerifier = new RecaptchaVerifier(
              auth,
              recaptchaRef.current,
              {
                size: "invisible",
              }
            );
            const confirm = await signInWithPhoneNumber(
              auth,
              `+${phone}`,
              recaptchaVerifier
            );
            setuser(confirm);
          } catch (error) {
            alert("Enter the valid number");
          }
        } else {
          
          alert("Invalid phone number ");
          console.log(phone)
        }
      } else {
        
        console.log("Response not ok");
      }
    } catch (error) {
      console.error("Error during fetch:", error.message);
    }
  };
  const handleCheck = async () => {
    try {
      const data = await user.confirm(otpin);
      console.log(data);
      alert("verification successful Update The Password");
      setVerified(true);
      setOtp(false)
    } catch (error) {
      alert("enter a valid otp");
      console.log(error);
    }
  };

  return (
    <>
      {loader ? <span className="loader"></span> : ""}
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
                  Phone number
                </label>
                <div className="d-flex">
                  <PhoneInput
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
                    disabled={verified}
                    dropdownStyle={{ backgroundColor: "black", color: "white" }}
                    country={"in"}
                    value={phone}
                    onChange={(value) => setPhone(value)}
                  />
                  {verified?"":<button
                    style={{
                      background: "none",
                      border: "none",
                      marginLeft: "-50px",
                      opacity: "0.5",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerification();
                    }}
                  >
                    Verify
                  </button>}
                  <div ref={recaptchaRef}></div>
                </div>
                {otp ? (
                  <div className="d-flex">
                    <input
                      style={{ marginTop: "3px" }}
                      value={otpin}
                      onChange={(e) => setOtpin(e.target.value)}
                    />
                    <button
                      className="btn btn-success p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCheck();
                      }}
                    >
                      check
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {verified ? (
                <div className="m-3">
                  <label
                    htmlFor="exampleInputPassword1"
                    className="form-label fs-4 text-dark"
                  >
                    Enter New Password
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
              ) : (
                ""
              )}
              <div className="m-2 mx-4 fs-4">
                <Link to={"/login"}>Login Here</Link>
              </div>

              {verified ? (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  Update Password{" "}
                  {loader ? <span className="loader2"></span> : ""}
                </button>
              ) : (
                ""
              )}
              <Link to="/createuser" className="m-3 btn btn-success">
                Create New User
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forget;
