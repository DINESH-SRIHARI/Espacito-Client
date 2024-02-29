import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import freedel from "../statics/Freedel.jpg";
export default function Carousal() {
  const [data, setData] = useState({ foodData: [], categoryData: [] });
  const [loader, setloader] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://espacito-client.onrender.com/getalldata` ||
            `https://espacito-client.onrender.com/getalldata`
        );
        setData(response.data);
        console.log("Category Data:", data.categoryData);
        console.log("Food Data:", data.foodData);
        setloader(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <span className="">{loader ? <span class="loader"></span> : ""}</span>

      <div
        id="carouselExampleAutoplaying"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-caption" style={{ zIndex: 10 }}>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-warning" type="submit">
                Search
              </button>
            </form>
          </div>
          <div className="carousel-item active">
            <img
              src="https://source.unsplash.com/2600x900/?Cuisine"
              className="d-block w-100"
              alt="Cuisine"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://source.unsplash.com/2600x900/?Gourmet"
              className="d-block w-100"
              alt="Gourmet"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://source.unsplash.com/2600x900/?food"
              className="d-block w-100"
              alt="Food"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleAutoplaying"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
        <div>
          <img src={freedel} className="gimg" />
        </div>
      </div>

      <div className="maindiv">
        {data.categoryData.map((foodcat) => (
          <div key={foodcat._id}>
            <div className="fs-3 m-3">{foodcat.catname}</div>
            <hr />
            <div className="card-container d-flex flex-wrap justify-content-evenly">
              {data.foodData
                .filter((foodIt) => foodcat.catname === foodIt.categoryName)
                .map((foodItem) => (
                  <Card key={foodItem._id} allitem={foodItem} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
