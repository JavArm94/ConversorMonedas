import { useState, useMemo } from "react";
import { Container, Select, Input } from "./CurrencySelect.styles";
import provinciasRaw from "../assets/Provincias.json";

function calcularGanancias(valor) {
  return valor * 0.3;
}

const TaxSelect = () => {
  const provincias = useMemo(
    () =>
      [...provinciasRaw].sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      ),
    []
  );

  const defaultProvincia =
    provincias.find((p) => p.descripcion === "Buenos Aires")?.codigo ||
    provincias[0].codigo;

  const [selectedProvincia, setSelectedProvincia] = useState(defaultProvincia);
  const [monto, setMonto] = useState("");

  const provinciaSeleccionada = provincias.find(
    (p) => p.codigo === selectedProvincia
  );

  const alicuotaSeleccionada = provinciaSeleccionada?.iibb || 0.0;
  const montoNumerico = parseFloat(monto) || 0;

  const iva = montoNumerico * 0.21;
  const iibb = montoNumerico * (alicuotaSeleccionada / 100);
  const ganancias = calcularGanancias(montoNumerico);
  const total = montoNumerico + iva + iibb + ganancias;

  return (
    <Container>
      <div className="taxSelectContainer">
        <div className="selectableTax">
          <label htmlFor="provincia">Provincia:</label>
          <Select
            id="provincia"
            value={selectedProvincia}
            onChange={(e) => setSelectedProvincia(e.target.value)}
          >
            {provincias.map((prov) => (
              <option key={prov.codigo} value={prov.codigo}>
                {prov.descripcion}
              </option>
            ))}
          </Select>

          <label className="amountLabel" htmlFor="monto">
            Monto:
          </label>
          <Input
            className="amountInput"
            id="monto"
            type="number"
            placeholder="Ingrese monto en pesos"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <div className="taxItems">
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
        </div>
      </div>
    </Container>
  );
};

export default TaxSelect;
