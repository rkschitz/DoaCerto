import React from "react";
import { Routes, Route } from "react-router-dom"; // Removido BrowserRouter daqui
import Header from "./components/Header/Header";
import Login from "./pages/login/Login";
import Register from "./pages/registro/RegistroOrganizacao";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/registrar" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
