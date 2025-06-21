import React, { useEffect, useState } from "react";
import { fetchConversion } from "../api/currencyService";
import { useCurrencyContext } from "../context/CurrencyContext";
import CurrencySelect from "../components/CurrencySelect";
import currencyData from "../assets/CurrencyTranslate.json";

const CurrencyExchange = () => {
  const { state, dispatch } = useCurrencyContext();
  const { currencies, conversion, error } = state;

  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState(1);
  const [localConversion, setLocalConversion] = useState();
  const [resultado, setResultado] = useState(0);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setLocalConversion();
  };

  useEffect(() => {
    if (!currencies.length) {
      const sortedCurrencies = [...currencyData].sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
      dispatch({ type: "FETCH_CURRENCIES_SUCCESS", payload: sortedCurrencies });
    }
  }, [currencies, dispatch]);

  useEffect(() => {
    if (currencies.length && !initialized) {
      const dolarEEUU = currencies.find((c) => c.nombre === "USD")?.nombre;
      const pesoArgentino = currencies.find((c) => c.nombre === "ARS")?.nombre;

      setFromCurrency(dolarEEUU || currencies[0].nombre);
      setToCurrency(
        pesoArgentino || currencies[1]?.nombre || currencies[0].nombre
      );
      setInitialized(true);
    }
  }, [currencies, initialized]);

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !value || !initialized) return;

    dispatch({ type: "FETCH_CONVERSION_START" });

    fetchConversion(fromCurrency, toCurrency)
      .then((data) => {
        if (!data) throw new Error("Empty conversion");
        dispatch({ type: "FETCH_CONVERSION_SUCCESS", payload: data });
      })
      .catch((err) => {
        dispatch({
          type: "FETCH_CONVERSION_ERROR",
          payload: err.message || "Conversion failed",
        });
      });
  }, [fromCurrency, toCurrency, dispatch, initialized]);

  useEffect(() => {
    if (conversion) {
      setLocalConversion(conversion);
      setResultado((value * conversion).toFixed(2));
    }
  }, [conversion, value]);

  if (!initialized) return <p>Cargando monedas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <CurrencySelect
        currencies={currencies}
        selected={fromCurrency}
        onCurrencyChange={setFromCurrency}
        amount={value}
        onAmountChange={setValue}
      />
      <button onClick={handleSwap}>⇄</button>
      <CurrencySelect
        currencies={currencies}
        selected={toCurrency}
        onCurrencyChange={setToCurrency}
        amount={value}
        onAmountChange={setValue}
        show={false}
      />
      <label>
        Resultado: <span>{resultado ? resultado : "Calculando..."}</span>
      </label>
    </div>
  );
};

export default CurrencyExchange;
