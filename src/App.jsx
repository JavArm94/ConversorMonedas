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
          <h2 className="title">DiviEx</h2>
          {/* {/*<div className="main-section"> */}

          <div className="card exchange-card">
          <h2>Conversion de divisas</h2>
            <CurrencyExchange />
          </div>
          <div className="card tax-card">
          <h2>Conversion de divisas</h2>
            <TaxSelect />
          </div>

          <div>
            <div className="card create-card">

            <button className="bntCreateEditDelete" onClick={toggleModo}>
              {modoGestionMoneda === "crear"
                ? "Editar/Eliminar monedas"
                : "Crear moneda"}
            </button>
            <hr className="divider"></hr>
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
