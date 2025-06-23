import { loadCustomCurrencies } from "../utils/CurrencyHelpers";

export default function rootReducer(state, action) {
  switch (action.type) {
    case "FETCH_CURRENCIES_START":
      return { ...state, loading: true, error: null };
    case "FETCH_CURRENCIES_SUCCESS":
      return {
        ...state,
        error: null,
        currencies: action.payload,
        loading: false,
      };
    case "FORCE_RELOAD_CURRENCIES": {
      const monedasPersonalizadas = loadCustomCurrencies();
      return {
        ...state,
        currencies: [
          ...state.currencies.filter((m) => !m.custom),
          ...monedasPersonalizadas,
        ],
      };
    }
    case "FORCE_RECONVERT": {
      return {
        ...state,
        reconvert: true,
      };
    }
    case "CLEAR_RECONVERT": {
      return {
        ...state,
        reconvert: false,
      };
    }
    case "FORCE_CONVERSION_FALLBACK":
      return {
        ...state,
        fallbackConversion: action.payload,
      };

    case "CLEAR_FALLBACK_CONVERSION":
      return {
        ...state,
        fallbackConversion: null,
      };
    case "FETCH_CURRENCIES_ERROR":
      return {
        ...state,
        currencies: [],
        error: action.payload,
        loading: false,
      };

    case "FETCH_CONVERSION_START":
      return { ...state, loading: true, error: null };
    case "FETCH_CONVERSION_SUCCESS":
      console.log(action);
      return { ...state, conversion: action.payload, loading: false };
    case "FETCH_CONVERSION_ERROR":
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
}
