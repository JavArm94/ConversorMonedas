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

  if (!initialized) return <p>Cargando monedas...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="sentCurrencyExchange">
      <div className="exchangeBox">
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
        {isFetching && <p>Cargando conversión...</p>}{" "}
      </div>
      <label>
        Resultado: <span>{resultado ? resultado : "Calculando..."}</span>
      </label>
    </div>
  );
};

export default CurrencyExchange;
