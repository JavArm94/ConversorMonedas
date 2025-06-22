import { useState } from "react";
import { useCurrencyContext } from "../context/CurrencyContext";
import { Container, Select, Input, Button } from "./CurrencySelect.styles";

const CreateCurrency = () => {
  const { state } = useCurrencyContext();
  const { currencies } = state;

  const [nombreMoneda, setNombreMoneda] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [monedaReferencia, setMonedaReferencia] = useState("");

  // ✅ Validación para evitar valores negativos
  const handleCantidadChange = (e) => {
    const value = parseFloat(e.target.value);

    if (!isNaN(value) && value >= 0) {
      setCantidad(value);
    } else if (e.target.value === "") {
      setCantidad(""); // permite borrar el campo
    }
    // si es negativo o NaN, no actualiza
  };

  const handleGuardar = () => {
    if (!nombreMoneda.trim() || !cantidad || !monedaReferencia) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    const cantidadNumerica = parseFloat(cantidad);
    if (isNaN(cantidadNumerica)) {
      alert("La cantidad debe ser un número válido.");
      return;
    }

    const monedaSeleccionada = currencies.find(
      (m) => m.nombre === monedaReferencia
    );

    if (!monedaSeleccionada) {
      alert("Moneda de referencia inválida.");
      return;
    }

    const nuevaMoneda = {
      Moneda: nombreMoneda.trim(),
      Cantidad: cantidadNumerica,
      ConvertidoA: {
        nombre: monedaSeleccionada.nombre,
        valor: monedaSeleccionada.valor,
      },
    };

    try {
      localStorage.setItem(
        `moneda_${nombreMoneda.trim().toLowerCase()}`,
        JSON.stringify(nuevaMoneda)
      );
      alert("Moneda guardada correctamente en localStorage.");
      setNombreMoneda("");
      setCantidad("");
      setMonedaReferencia("");
    } catch (e) {
      alert("Error al guardar en localStorage.");
      console.error(e);
    }
  };

  return (
    <Container>
      <div className="currencyContainer">
        <h2>Crear Moneda</h2>
        <div className="currencyInfoBox">
          <label>Nombre de la nueva moneda:</label>
          <Input
            className="amountInput"
            type="text"
            placeholder="Ej: Peso Argentino"
            value={nombreMoneda}
            onChange={(e) => setNombreMoneda(e.target.value)}
          />

          <label className="amountLabel">Cantidad:</label>
          <Input
            type="number"
            placeholder="Ej: 1000"
            value={cantidad}
            onChange={handleCantidadChange}
            min="0" // ⬅️ también evitamos valores negativos desde el input
          />
        </div>

        <div className="saveCurrencyBox">
          <label>Moneda base de referencia:</label>
          <Select
            value={monedaReferencia}
            onChange={(e) => setMonedaReferencia(e.target.value)}
          >
            <option value="">Seleccione una moneda</option>
            {currencies?.map((currency) => (
              <option key={currency.nombre} value={currency.nombre}>
                {currency.descripcion}
              </option>
            ))}
          </Select>

          <Button
            className="saveCurrencyButton"
            onClick={handleGuardar}
          >
            Guardar Moneda
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CreateCurrency;
