import React, { useEffect, useState } from "react";
import { fetchCurrencies, fetchConversion } from "../api/currencyService";
import { useCurrencyContext } from "../context/CurrencyContext";
import CurrencySelect from "../components/CurrencySelect";

const CurrencyExchange = () => {
  const { state, dispatch } = useCurrencyContext();
  const { currencies, loading, error, conversion } = state;
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("ARS");
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState(1);
  const [localConversion, setLocalConversion] = useState();
  const [resultado, setResultado] = useState(0);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setLocalConversion();
  };

  const setAmount = () => {
    if (currencies.length && !initialized) {
      const defaultFrom =
        currencies.find((c) => c.nombre === "USD")?.nombre ||
        currencies[0]?.nombre;

      const defaultTo =
        currencies.find((c) => c.nombre === "ARS")?.nombre ||
        currencies[1]?.nombre ||
        currencies[0]?.nombre;

      setFromCurrency(defaultFrom);
      setToCurrency(defaultTo);
      setInitialized(true);
    }
  };

  useEffect(() => {
    setAmount();
    console.log("estado log" + loading, error, conversion);
  }, [currencies]);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "FETCH_CURRENCIES_START" });

    fetchCurrencies({ signal: controller.signal })
      .then((data) => {
        if (!data?.length) {
          throw new Error("Received empty data");
        }
        console.log(data);
        dispatch({ type: "FETCH_CURRENCIES_SUCCESS", payload: data });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        dispatch({
          type: "FETCH_CURRENCIES_ERROR",
          payload: err.message || "Failed to load currencies",
        });
      });

    return () => controller.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !value || !initialized) return;

    dispatch({ type: "FETCH_CONVERSION_START" });

    fetchConversion(fromCurrency, toCurrency)
      .then((data) => {
        if (!data) throw new Error("Empty conversion");
        console.log("AVER" + data);

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

  if (loading && !currencies.length && !initialized) return <p>Cargando...</p>;
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
