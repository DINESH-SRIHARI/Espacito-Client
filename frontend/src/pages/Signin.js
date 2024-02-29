import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import backgroungsign from "../statics/signin.jpg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/setup";

export default function Signin() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    geolocation: "",
  });
  const [loader, setLoader] = useState(false);
  const [otp, setOtp] = useState(false);
  const [otpin, setOtpin] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setuser] = useState(null);
  const [verified,setverified]=useState(false);
  const recaptchaRef = useRef(null);
  let navigate = useNavigate();

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
    fetchUserLocation();
  }, []);

  const handleVerification = async () => {
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
      alert("enter the valid number");
    }
  };
  const handleCheck = async () => {
    try {
      const data = await user.confirm(otpin);
      console.log(data);
      alert("verification successful")
      setverified(true)
    } catch (error) {
      alert("enter a valid otp");
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    if(verified){
      try {
        const response = await fetch(`http://localhost:5000/createuser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: credentials.name,
            phone: `+${phone}`,
            email: credentials.email,
            password: credentials.password,
            geolocation: credentials.geolocation,
          }),
        });
  
        if (!response.ok) {
          alert("There is some error. Please check it");
          console.log(response);
          setLoader(false);
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          alert("New User Added Successfully");
          setLoader(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during fetch:", error.message);
      }
    }else{
      setLoader(false)
      alert("Verify your mobile number to create a Account")
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
                <button
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
                </button>
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
            <button onClick={handleSubmit} className="btn btn-primary">
              Submit{loader ? <span className="loader2"></span> : ""}
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
