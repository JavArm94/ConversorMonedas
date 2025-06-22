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
      <h2>Crear Moneda Personalizada</h2>

      <label>Nombre de la nueva moneda:</label>
      <Input
        type="text"
        placeholder="Ej: MiPeso"
        value={nombreMoneda}
        onChange={(e) => setNombreMoneda(e.target.value.toUpperCase())}
      />

      <label>¿Cuántos {nombreMoneda || "MiMoneda"} equivalen a 1 USD?</label>
      <Input
        type="number"
        placeholder="Ej: 5500"
        value={cantidad}
        min="0.0001"
        step="any"
        onChange={(e) => setCantidad(e.target.value)}
      />

      <Button onClick={handleGuardar}>Guardar Moneda</Button>
    </Container>
  );
};

export default CreateCurrency;
