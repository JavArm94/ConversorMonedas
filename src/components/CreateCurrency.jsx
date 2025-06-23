import { useState } from "react";
import { useCurrencyContext } from "../context/CurrencyContext";
import { Container, Input, Button } from "./CurrencySelect.styles";

const CreateCurrency = () => {
  const { dispatch } = useCurrencyContext();

  const [nombreMoneda, setNombreMoneda] = useState("");
  const [cantidad, setCantidad] = useState("");

  const handleGuardar = () => {
    if (!nombreMoneda.trim() || !cantidad) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    const cantidadNumerica = parseFloat(cantidad);
    if (isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
      alert("La cantidad debe ser un número válido mayor a 0.");
      return;
    }

    const valorContraDolar = 1 / cantidadNumerica;

    const nuevaMoneda = {
      Moneda: nombreMoneda.toUpperCase(),
      Cantidad: cantidadNumerica,
      ConvertidoA: {
        nombre: "USD",
        valor: valorContraDolar,
      },
    };

    localStorage.setItem(
      `moneda_${nuevaMoneda.Moneda.toLowerCase()}`,
      JSON.stringify(nuevaMoneda)
    );

    alert("Moneda guardada correctamente en localStorage.");
    dispatch({ type: "FORCE_RELOAD_CURRENCIES" });
    setNombreMoneda("");
    setCantidad("");
  };

  return (
    <Container>
      <div className="currencyContainer">
        <h2>Crear Moneda Personalizada</h2>
        <div className="currencyInfoBox">
          <label>Nombre de la nueva moneda:</label>
          <Input
            className="amountInput"
            type="text"
            placeholder="Ej: MiPeso"
            value={nombreMoneda}
            onChange={(e) => setNombreMoneda(e.target.value.toUpperCase())}
          />
        </div>
        <div className="currencyInfoBox">
          <label className="amountLabel">
            ¿Cuántos {nombreMoneda || "MiMoneda"} equivalen a 1 USD?
          </label>
          <Input
            className="amountInput"
            type="number"
            placeholder="Ej: 5500"
            value={cantidad}
            min="0.0001"
            step="any"
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div className="saveCurrencyBox">
          <Button className="saveCurrencyButton" onClick={handleGuardar}>
            Guardar Moneda
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default CreateCurrency;
