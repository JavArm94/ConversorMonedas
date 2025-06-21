import { useState } from "react";
import { Container, Select, Input } from "./CurrencySelect.styles";

// Carga de provincias y alícuotas desde las variables de entorno
const provincias = import.meta.env.VITE_PROV_STRING.split("_");
const alicuotas = import.meta.env.VITE_IIBB_STRING.split("_");

const provinciasConIIBB = provincias.map((prov, idx) => ({
  nombre: prov,
  alicuota: parseFloat(alicuotas[idx]) || 0.0,
}));

// Función que aplica el 30% de ganancias
function calcularGanancias(valor) {
  return valor * 0.3;
}

const TaxSelect = () => {
  const [selectedProvincia, setSelectedProvincia] = useState(provincias[0]);
  const [monto, setMonto] = useState("");

  const alicuotaSeleccionada =
    provinciasConIIBB.find((p) => p.nombre === selectedProvincia)?.alicuota ||
    0.0;

  const montoNumerico = parseFloat(monto) || 0;

  // Cálculos de impuestos
  const iva = montoNumerico * 0.21;
  const iibb = montoNumerico * (alicuotaSeleccionada / 100);
  const ganancias = calcularGanancias(montoNumerico);

  const total = montoNumerico + iva + iibb + ganancias;

  return (
    <Container>
      <label htmlFor="provincia">Provincia:</label>
      <Select
        id="provincia"
        value={selectedProvincia}
        onChange={(e) => setSelectedProvincia(e.target.value)}
      >
        {provinciasConIIBB.map((prov) => (
          <option key={prov.nombre} value={prov.nombre}>
            {prov.nombre}
          </option>
        ))}
      </Select>

      <label htmlFor="monto">Monto:</label>
      <Input
        id="monto"
        type="number"
        placeholder="Ingrese monto en pesos"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
      />

      <div>
        <label>IIBB: {alicuotaSeleccionada}%</label>
      </div>
      <div>
        <label>IVA: 21%</label>
      </div>
      <div>
        <label>Ganancias: 30%</label>
      </div>

      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
        <label>Total final: ${total.toFixed(2)}</label>
      </div>
    </Container>
  );
};

export default TaxSelect;
