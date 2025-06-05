// import Home from './pages/Home'
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/Context";
import React, { use, useEffect } from "react";
import Layout from "./components/Layout/Layout";
// import Profile from './pages/Profile';
// import Favorites from './pages/Favorites';
// import BreedFeed from './pages/Breeds';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Donatario from "./pages/Donatario/Donatario.jsx";
import Pessoa from "./pages/Pessoa/Pessoa.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/registro/RegisterPerson.jsx";
import Organizacao from "./pages/Organizacao/Organizacao.jsx";
import Movimentacao from "./pages/Movimentacao/Movimentacao.jsx";
import Campanha from "./pages/Campanha/Campanha.jsx";
import Home from "./pages/Home/Home.jsx";

const App = () => {
  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          {role === "A" && (<Route path="/organizacoes" element={<Organizacao />} />)}
          {role && <Route path="/donatarios" element={<Donatario />} />}
          {role && <Route path="/pessoa" element={<Pessoa />} />}
          {role && <Route path="/movimentacoes" element={<Movimentacao />} />}
          {role && <Route path="/campanhas" element={<Campanha />} />}
          {role && <Route path="/" element={<div>Ola mundo</div>} />}
        </Route>
        <Route path="/*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ width: "50%" }}
      />
    </AuthProvider>
  );
};

export default App;
