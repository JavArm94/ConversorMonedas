import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchCurrencies = async () => {
  try {
    const response = await axios.get(`${apiUrl}/list?access_key=${apiKey}`);

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

    await new Promise((resolve) => setTimeout(resolve, 1000)); // delay para evitar que rechaze la api

    return symbolsArray;
  } catch (error) {
    console.error("Error fetching currencies:", error);

    // Handle different types of errors
    let errorMessage = "Failed to fetch currencies";
    if (error.response) {
      errorMessage = `API Error: ${error.response.status} - ${
        error.response.data?.message || "Unknown error"
      }`;
    } else if (error.request) {
      errorMessage = "No response from server";
    }

    throw new Error(errorMessage);
  }
};

export const fetchConversion = async (from, to) => {
  try {
    console.log("from" + from, "to" + to);

    const response = await axios.get(
      `${apiUrl}/convert?access_key=${apiKey}&from=${from}&to=${to}&amount=1`
    );

    console.log(response);

    // Check if the response contains currencies data
    if (!response.data?.result) {
      throw new Error("Invalid API response structure");
    }

    return response.data.result;
  } catch (error) {
    console.error("Error fetching conversion:", error);

    // Handle different types of errors
    let errorMessage = "Failed to fetch conversion";
    if (error.response) {
      errorMessage = `API Error: ${error.response.status} - ${
        error.response.data?.message || "Unknown error"
      }`;
    } else if (error.request) {
      errorMessage = "No response from server";
    }

    throw new Error(errorMessage);
  }
};
