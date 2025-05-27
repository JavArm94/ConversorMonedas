export default function currencyReducer(state, action) {
  switch (action.type) {
    case "FETCH_CURRENCIES_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_CURRENCIES_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null, // <-- Asegúrate de limpiar errores previos
        currencies: action.payload,
      };
    case "FETCH_CURRENCIES_ERROR":
      return {
        ...state,
        loading: false,
        currencies: [], // <-- Opcional: limpiar datos en error
        error: action.payload,
      };
    default:
      return state;
  }
}
