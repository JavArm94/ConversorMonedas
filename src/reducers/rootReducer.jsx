export default function rootReducer(state, action) {
  switch (action.type) {
    // Currency
    case "FETCH_CURRENCIES_START":
      return { ...state, loading: true, error: null };
    case "FETCH_CURRENCIES_SUCCESS":
      return {
        ...state,
        error: null,
        currencies: action.payload,
        loading: false,
      };
    case "FETCH_CURRENCIES_ERROR":
      return {
        ...state,
        currencies: [],
        error: action.payload,
        loading: false,
      };

    // Conversion
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
