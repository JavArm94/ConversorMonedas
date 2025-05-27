import React, { createContext, useContext, useReducer } from "react";
import currencyReducer from "../reducers/currencyReducer";

const CurrencyContext = createContext();

const initialState = {
  currencies: [],
  loading: false,
  error: null,
};

export const CurrencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currencyReducer, initialState);
  return (
    <CurrencyContext.Provider value={{ state, dispatch }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
