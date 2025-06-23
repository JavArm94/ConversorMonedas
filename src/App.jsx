import React, { useState } from "react";
import { CurrencyProvider } from "./context/CurrencyContext";
import CurrencyExchange from "./containers/CurrencyExchange";
import CreateCurrency from "./components/CreateCurrency";
import ManageCurrencies from "./components/ManageCurrencies";
import TaxSelect from "./components/TaxSelect";
import GlobalStyles from "./styles/GlobalStyles";
import "./App.css";

function App() {
  const [modoGestionMoneda, setModoGestionMoneda] = useState("crear"); // o 'editar'

  const toggleModo = () => {
    setModoGestionMoneda((prev) => (prev === "crear" ? "editar" : "crear"));
  };

  return (
    <>
      <GlobalStyles />
      <CurrencyProvider>
        <div className="app-container">
          <h1 className="title">DiviEx</h1>
          {/* {/*<div className="main-section"> */}
          <div className="card exchange-card">
            <CurrencyExchange />
          </div>
          <div className="card tax-card">
            <TaxSelect />
          </div>
          <div style={{ marginTop: "2rem" }}>
            <button onClick={toggleModo}>
              {modoGestionMoneda === "crear"
                ? "Editar/Eliminar monedas"
                : "Crear moneda"}
            </button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <div className="card create-card">
              {modoGestionMoneda === "crear" && <CreateCurrency />}

              {modoGestionMoneda === "editar" && <ManageCurrencies />}
            </div>
          </div>
        </div>
      </CurrencyProvider>
    </>
  );
}

export default App;
