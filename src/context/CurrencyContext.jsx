import React, { createContext, useContext, useReducer } from "react";
import rootReducer from "../reducers/rootReducer";

const CurrencyContext = createContext();

const initialState = {
  currencies: [],
  loading: false,
  error: null,
  conversion: 0,
};

export const CurrencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);
  return (
    <CurrencyContext.Provider value={{ state, dispatch }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = () => useContext(CurrencyContext);
