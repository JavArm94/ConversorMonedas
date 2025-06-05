import React, { useEffect, useState } from "react";
import { fetchCurrencies, fetchConversion } from "../api/currencyService";
import { useCurrencyContext } from "../context/CurrencyContext";
import CurrencySelect from "../components/CurrencySelect";

const CurrencyExchange = () => {
  const { state, dispatch } = useCurrencyContext();
  const { currencies, loading, error } = state;
  const [fromCurrency, setFromCurrency] = useState(currencies[0]?.nombre || "");
  const [toCurrency, setToCurrency] = useState(currencies[1]?.nombre || "");
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState(1);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const setAmount = () => {
    if (currencies.length && !initialized) {
      const defaultFrom =
        currencies.find((c) => c.nombre === "USD")?.nombre ||
        currencies[0]?.nombre;

      const defaultTo =
        currencies.find((c) => c.nombre === "EUR")?.nombre ||
        currencies[1]?.nombre ||
        currencies[0]?.nombre;

      setFromCurrency(defaultFrom);
      setToCurrency(defaultTo);
      setInitialized(true);
      console.log(currencies);
    }
  };

  useEffect(() => {
    setAmount();
  }, [currencies]);

  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
      console.log("hit");

      dispatch({ type: "FETCH_CURRENCIES_START" });

      try {
        const data = await fetchCurrencies({ signal: controller.signal });

        if (!data?.length) {
          throw new Error("Received empty data");
        }

        dispatch({ type: "FETCH_CURRENCIES_SUCCESS", payload: data });
      } catch (err) {
        if (err.name === "AbortError") return; // Se abortó la solicitud, no hacer nada

        dispatch({
          type: "FETCH_CURRENCIES_ERROR",
          payload: err.message || "Failed to load currencies",
        });
      }
    };

    const getConversion = async () => {
      dispatch({ type: "FETCH_CONVERSION_START" });

      try {
        const data = await fetchConversion({
          signal: controller.signal,
          fromCurrency,
          toCurrency,
          value,
        });

        if (!data?.length) {
          throw new Error("Received empty data");
        }

        dispatch({ type: "FETCH_CONVERSION_SUCCESS", payload: data });
      } catch (err) {
        if (err.name === "AbortError") return; // Se abortó la solicitud, no hacer nada

        dispatch({
          type: "FETCH_CONVERSION_ERROR",
          payload: err.message || "Failed to load conversion",
        });
      }
    };

    getData();
    getConversion();
    //  return () => {
    //    controller.abort(); // Cancelar la solicitud si el componente se desmonta
    //  };
  }, [dispatch]);

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
      />
      <label></label>
    </div>
  );
};

export default CurrencyExchange;
