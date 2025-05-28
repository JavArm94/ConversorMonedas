import React, { useEffect } from "react";
import { fetchCurrencies } from "../api/currencyService";
import { useCurrencyContext } from "../context/CurrencyContext";
import CurrencySelect from "../components/CurrencySelect";

const CurrencyExchange = () => {
  const { state, dispatch } = useCurrencyContext();
  const { currencies, loading, error } = state;
  useEffect(() => {
    const controller = new AbortController();

    const getData = async () => {
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

    getData();

    return () => {
      controller.abort(); // Cancelar la solicitud si el componente se desmonta
    };
  }, [dispatch]);

  if (loading && !currencies.length) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <CurrencySelect currencies={currencies} />
    </div>
  );
};

export default CurrencyExchange;
