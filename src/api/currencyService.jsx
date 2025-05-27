import axios from "axios";

export const fetchCurrencies = async () => {
  try {
    // Note: The ExchangeRate API doesn't actually require an access_key
    // Remove it or replace with your actual key if needed
    const response = await axios.get(
      "https://api.exchangerate.host/list?access_key=33ed1337544d64e1026bc07d524aca05"
    );

    // Check if the response contains currencies data
    if (!response.data?.currencies) {
      throw new Error("Invalid API response structure");
    }

    // Transform the currencies object into an array
    const symbolsArray = Object.entries(response.data.currencies).map(
      ([code, name]) => ({
        nombre: code,
        descripcion: name,
      })
    );

    return symbolsArray;
  } catch (error) {
    console.error("Error fetching currencies:", error);

    // Handle different types of errors
    let errorMessage = "Failed to fetch currencies";
    if (error.response) {
      // The request was made and the server responded with a status code
      errorMessage = `API Error: ${error.response.status} - ${
        error.response.data?.message || "Unknown error"
      }`;
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = "No response from server";
    }

    throw new Error(errorMessage);
  }
};
