import React from "react";
import { Link } from "react-router-dom";
import { CgMouse } from "react-icons/cg";

const Home = () => {
  return (
    <>
      <div>
        <p>Welcome to Ecommerce</p>
        <h1>Find Amazing products below</h1>
        <Link to="#container">
          <button>
            Scrool <CgMouse />
          </button>
        </Link>
      </div>
      Home
    </>
  );
};

export default Home;
