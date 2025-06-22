import axios from "axios";
import { getCustomCurrencies } from "../utils/CurrencyUtils";
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchCurrencies = async () => {
  try {
    const response = await axios.get(`${apiUrl}/list?access_key=${apiKey}`);

    if (!response.data?.currencies) {
      throw new Error("Invalid API response structure");
    }

    const symbolsArray = Object.entries(response.data.currencies).map(
      ([code, name]) => ({
        nombre: code,
        descripcion: name,
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return symbolsArray;
  } catch (error) {
    console.error("Error fetching currencies:", error);

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
    const customCurrencies = getCustomCurrencies();

    const fromCustom = customCurrencies.find(
      (c) => c.nombre.toUpperCase() === from.toUpperCase()
    );
    const toCustom = customCurrencies.find(
      (c) => c.nombre.toUpperCase() === to.toUpperCase()
    );

    if (fromCustom && toCustom) {
      const usdValue = 1 * fromCustom.valor;
      const result = usdValue / toCustom.valor;
      return result;
    }

    if (fromCustom) {
      const usdAmount = 1 * fromCustom.valor;

      if (to.toUpperCase() === "USD") return usdAmount;

      const response = await axios.get(
        `${apiUrl}/convert?access_key=${apiKey}&from=USD&to=${to}&amount=${usdAmount}`
      );
      return response.data.result;
    }

    // Solo "to" es personalizada
    if (toCustom) {
      const response = await axios.get(
        `${apiUrl}/convert?access_key=${apiKey}&from=${from}&to=USD&amount=1`
      );
      const usdValue = response.data.result;
      return usdValue / toCustom.valor;
    }

    // Ambas son monedas oficiales
    const response = await axios.get(
      `${apiUrl}/convert?access_key=${apiKey}&from=${from}&to=${to}&amount=1`
    );

    if (!response.data?.result) {
      throw new Error("Invalid API response structure");
    }

    return response.data.result;
  } catch (error) {
    console.error("Error fetching conversion:", error);

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
