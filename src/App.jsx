import React, { useState } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import { CurrencyProvider } from "./context/CurrencyContext";
import CurrencyExchange from "./containers/CurrencyExchange";
import CreateCurrency from "./components/CreateCurrency";
import ManageCurrencies from "./components/ManageCurrencies";
import TaxSelect from "./components/TaxSelect";

function App() {
  const [modoGestionMoneda, setModoGestionMoneda] = useState("crear"); // o 'editar'

  const toggleModo = () => {
    setModoGestionMoneda((prev) => (prev === "crear" ? "editar" : "crear"));
  };

  return (
    <>
      <GlobalStyles />
      <CurrencyProvider>
        <CurrencyExchange />
        <TaxSelect />

        <div style={{ marginTop: "2rem" }}>
          <button onClick={toggleModo}>
            {modoGestionMoneda === "crear"
              ? "Editar/Eliminar monedas"
              : "Crear moneda"}
          </button>
        </div>

        <div style={{ marginTop: "1rem" }}>
          {modoGestionMoneda === "crear" && <CreateCurrency />}
          {modoGestionMoneda === "editar" && <ManageCurrencies />}
        </div>
      </CurrencyProvider>
    </>
  );
}

export default App;
