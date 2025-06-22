import axios from "axios";
import { getCustomCurrencies } from "../utils/CurrencyUtils";
const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchConversion = async (from, to) => {
  try {
    const customCurrencies = getCustomCurrencies();

    const fromCustom = customCurrencies.find(
      (c) => c.nombre.toUpperCase() === from.toUpperCase()
    );
    const toCustom = customCurrencies.find(
      (c) => c.nombre.toUpperCase() === to.toUpperCase()
    );

    // Caso: Ambas monedas son personalizadas
    if (fromCustom && toCustom) {
      const usdValue = 1 * fromCustom.valor; // valor 1 "from" en USD
      const result = usdValue / toCustom.valor; // valor convertido
      console.log(`[Custom -> Custom] ${from} to ${to}:`, result);
      return result;
    }

    // Caso: "from" es personalizada, "to" oficial
    if (fromCustom) {
      const usdAmount = 1 * fromCustom.valor;
      if (to.toUpperCase() === "USD") {
        console.log(`[Custom -> USD] ${from} to USD:`, usdAmount);
        return usdAmount;
      }

      const response = await axios.get(
        `${apiUrl}/convert?access_key=${apiKey}&from=USD&to=${to}&amount=${usdAmount}`
      );
      console.log(`[Custom -> Official] API response:`, response.data);

      if (!response.data || typeof response.data.result !== "number") {
        console.error("Respuesta API inesperada:", response.data);
        throw new Error("Invalid API response structure");
      }

      return response.data.result;
    }

    // Caso: "to" es personalizada, "from" oficial
    if (toCustom) {
      const response = await axios.get(
        `${apiUrl}/convert?access_key=${apiKey}&from=${from}&to=USD&amount=1`
      );
      console.log(`[Official -> Custom] API response:`, response.data);

      if (!response.data || typeof response.data.result !== "number") {
        console.error("Respuesta API inesperada:", response.data);
        throw new Error("Invalid API response structure");
      }

      const usdValue = response.data.result;
      const result = usdValue / toCustom.valor;
      return result;
    }

    // Caso: Ambas oficiales
    const response = await axios.get(
      `${apiUrl}/convert?access_key=${apiKey}&from=${from}&to=${to}&amount=1`
    );
    console.log(`[Official -> Official] API response:`, response.data);

    if (!response.data || typeof response.data.result !== "number") {
      console.error("Respuesta API inesperada:", response.data);
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
