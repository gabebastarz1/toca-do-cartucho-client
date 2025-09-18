import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/produtos");
  }, [navigate]);

  return null;
};

export default Home;
