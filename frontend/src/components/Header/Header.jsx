import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./header.module.css";
import Logo from "../../img/logo-doa-certo.png";
import { AuthContext } from "../../auth/Context";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, token, role } = useContext(AuthContext);
  return (
    <header className={styles.header}>
      <img src={Logo} alt="Logo" className={styles.logo} />
      <nav className={styles.navLinks}>
        <a onClick={() => navigate("/")} className={location.pathname === "/" ? styles.activeLink : ""}>Home </a>
        {role && <a onClick={() => navigate("/donatarios")} className={location.pathname === "/donatarios" ? styles.activeLink : ""}>Gerenciar Donatarios</a>}
        {(role === 'A' || role === 'O') && <a onClick={() => navigate("/pessoa")} className={location.pathname === "/pessoa" ? styles.activeLink : ""}>Gerenciar Pessoas</a>}
        {role === 'A' && <a onClick={() => navigate("/organizacoes")} className={location.pathname === "/organizacoes" ? styles.activeLink : ""}>Gerenciar Organizações</a>}
        {(role === 'A' || role === 'O') && <a onClick={() => navigate("/movimentacoes")} className={location.pathname === "/movimentacoes" ? styles.activeLink : ""}>Movimentações</a>}
        {(role === 'A' || role === 'O') && <a onClick={() => navigate("/campanhas")} className={location.pathname === "/campanhas" ? styles.activeLink : ""}>Campanhas</a>}
      </nav>
      <div className={styles.authButtons}>
        <div className={styles.dropdown}>
          <div className={styles.dropdownOptions}>
            <button
              className={styles.btnAuth}
              onClick={() => navigate("/registerDoador")}
            >
              Doador
            </button>
            <button
              className={styles.btnAuth}
              onClick={() => navigate("/registerPerson")}
            >
              Organização
            </button>
          </div>
        </div>
        {!token ? <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
          :
          <button className={styles.logoutBtn} onClick={logout}>Logout</button>}
      </div>
    </header>
  );
};

export default Header;
