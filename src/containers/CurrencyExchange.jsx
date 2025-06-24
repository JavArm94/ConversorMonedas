import React, { useEffect, useState } from "react";
import { fetchConversion } from "../api/currencyService";
import { useCurrencyContext } from "../context/CurrencyContext";
import CurrencySelect from "../components/CurrencySelect";
import currencyData from "../assets/CurrencyTranslate.json";

const CurrencyExchange = () => {
  const { state, dispatch } = useCurrencyContext();
  const { currencies, conversion } = state;

  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [value, setValue] = useState(1);
  const [localConversion, setLocalConversion] = useState();
  const [resultado, setResultado] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleSwap = () => {
    if (localConversion) {
      setLocalConversion(1 / localConversion);
      setResultado((value * (1 / localConversion)).toFixed(2));
    } else {
      setLocalConversion(undefined);
    }
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    if (!currencies.length) {
      const sortedCurrencies = [...currencyData].sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      );
      dispatch({ type: "FETCH_CURRENCIES_SUCCESS", payload: sortedCurrencies });
      dispatch({ type: "FORCE_RELOAD_CURRENCIES" });
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
    if (!initialized || !currencies.length) return;

    const currencyCodes = currencies.map((c) => c.nombre);
    const fromValid = currencyCodes.includes(fromCurrency);
    const toValid = currencyCodes.includes(toCurrency);

    const defaultFrom = currencyCodes.includes("USD")
      ? "USD"
      : currencies[0].nombre;
    const defaultTo = currencyCodes.includes("ARS")
      ? "ARS"
      : currencies[1]?.nombre || currencies[0].nombre;

    if (!fromValid || !toValid) {
      const newFrom = fromValid ? fromCurrency : defaultFrom;
      const newTo = toValid ? toCurrency : defaultTo;

      setFromCurrency(newFrom);
      setToCurrency(newTo);
      fetchConversion(newFrom, newTo)
        .then((data) => {
          dispatch({ type: "FETCH_CONVERSION_SUCCESS", payload: data });
        })
        .catch((err) => {
          dispatch({
            type: "FETCH_CONVERSION_ERROR",
            payload: err.message || "Conversion failed",
          });
        });
    }
  }, [currencies, fromCurrency, toCurrency, initialized, dispatch]);

  useEffect(() => {
    if (state.reconvert && fromCurrency && toCurrency && value) {
      fetchConversion(fromCurrency, toCurrency)
        .then((data) => {
          dispatch({ type: "FETCH_CONVERSION_SUCCESS", payload: data });
          dispatch({ type: "CLEAR_RECONVERT" });
        })
        .catch((err) => {
          dispatch({
            type: "FETCH_CONVERSION_ERROR",
            payload: err.message || "Error al forzar conversión",
          });
          dispatch({ type: "CLEAR_RECONVERT" });
        });
    }
  }, [state.reconvert, fromCurrency, toCurrency, value, dispatch]);

  useEffect(() => {
    if (!fromCurrency || !toCurrency || !value || !initialized) return;

    const fromCustom = currencies.find(
      (c) => c.nombre === fromCurrency && c.valor
    );
    const toCustom = currencies.find((c) => c.nombre === toCurrency && c.valor);

    if (fromCustom?.personalizada || toCustom?.personalizada) return;

    setIsFetching(true);
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
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [fromCurrency, toCurrency, dispatch, initialized]);

  useEffect(() => {
    if (conversion) {
      setLocalConversion(conversion);
      setResultado((value * conversion).toFixed(conversion >= 0.01 ? 2 : 4));
    }
  }, [conversion, value]);

  const handleValueChange = (val) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setValue(parsed);
    }
  };

  const loadingGlobal = !initialized || isFetching || resultado === null;

  // if (error) return <p>Error: {error}</p>;

  return (
    <div className="sentCurrencyExchange">
      {loadingGlobal ? (
        <div className="loadingContainer">
          <span className="spinner" />
          <p>Cargando...</p>
        </div>
      ) : (
        <div className="exchangeBox">
          <div className="noResult">
            <CurrencySelect
              currencies={currencies}
              selected={fromCurrency}
              onCurrencyChange={setFromCurrency}
              amount={value}
              onAmountChange={handleValueChange}
            />
            <button onClick={handleSwap} disabled={isFetching}>
              ⇄
            </button>
            <CurrencySelect
              currencies={currencies}
              selected={toCurrency}
              onCurrencyChange={setToCurrency}
              amount={value}
              onAmountChange={handleValueChange}
              show={false}
            />
          </div>
          <label>
            Resultado: <span>{resultado}</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default CurrencyExchange;
