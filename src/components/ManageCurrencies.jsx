import React, { useEffect, useState } from "react";
import { useCurrencyContext } from "../context/CurrencyContext";

const formatValor = (num) => {
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return "—";
  if (parsed >= 0.01) return parsed.toFixed(parsed >= 1 ? 2 : 4);
  return parsed.toExponential(4);
};

const isNombreValido = (nombre) =>
  /^[A-Z]+$/.test(nombre.trim()) && nombre.trim().length > 0;

const ManageCurrencies = () => {
  const [monedasPersonalizadas, setMonedasPersonalizadas] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { dispatch } = useCurrencyContext();

  const cargarMonedasDesdeLocalStorage = () => {
    const personalizadas = [];

    for (let key in localStorage) {
      if (key.startsWith("moneda_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data?.Moneda && data?.ConvertidoA?.valor > 0) {
            personalizadas.push({
              nombre: data.Moneda.toUpperCase(),
              cantidad: data.Cantidad || 1,
              valor: parseFloat(data.ConvertidoA.valor),
            });
          }
        } catch (e) {
          console.warn("Error leyendo moneda personalizada", e);
        }
      }
    }

    setMonedasPersonalizadas(personalizadas);

    dispatch({ type: "FORCE_RELOAD_CURRENCIES" });
    dispatch({ type: "FORCE_RECONVERT" });
  };

  useEffect(() => {
    cargarMonedasDesdeLocalStorage();
  }, []);

  const handleChange = (index, value) => {
    const num = parseFloat(value);
    const actualizadas = [...monedasPersonalizadas];

    if (!isNaN(num) && num > 0) {
      actualizadas[index].cantidad = num;
      setMonedasPersonalizadas(actualizadas);
    } else if (value === "") {
      actualizadas[index].cantidad = "";
      setMonedasPersonalizadas(actualizadas);
    }
  };

  const handleSave = async (moneda) => {
    const key = `moneda_${moneda.nombre.toLowerCase()}`;
    const cantidad = parseFloat(moneda.cantidad);

    if (!isNombreValido(moneda.nombre)) {
      alert("Nombre inválido. Solo letras en mayúsculas sin espacios.");
      return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Cantidad inválida. Debe ser mayor que cero.");
      return;
    }

    const valorUSD = 1 / cantidad;

    setIsSaving(true);
    localStorage.setItem(
      key,
      JSON.stringify({
        Moneda: moneda.nombre,
        Cantidad: cantidad,
        ConvertidoA: {
          nombre: "USD",
          valor: valorUSD,
        },
      })
    );

    setTimeout(() => {
      setIsSaving(false);
      alert("Moneda actualizada correctamente.");
      cargarMonedasDesdeLocalStorage();
    }, 500);
  };

  const handleDelete = (nombre) => {
    localStorage.removeItem(`moneda_${nombre.toLowerCase()}`);
    const actualizadas = monedasPersonalizadas.filter(
      (m) => m.nombre !== nombre
    );
    setMonedasPersonalizadas(actualizadas);

    dispatch({ type: "FORCE_RELOAD_CURRENCIES" });
    dispatch({
      type: "FORCE_CONVERSION_FALLBACK",
      payload: {
        fallbackFrom: "USD",
        fallbackTo: "ARS",
      },
    });
  };

  return (
    <div>
      <h3>Monedas Personalizadas</h3>

      {monedasPersonalizadas.length === 0 ? (
        <p>No hay monedas personalizadas.</p>
      ) : (
        monedasPersonalizadas.map((moneda, index) => {
          const cantidad = moneda.cantidad;
          const valorUSD = cantidad > 0 ? 1 / cantidad : 0;

          return (
            <div
              key={moneda.nombre}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <strong>{moneda.nombre}</strong>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label>Cantidad (equivale a 1 USD):</label>
                <input
                  type="number"
                  min="0.0001"
                  step="any"
                  value={cantidad}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>

              {cantidad > 0 && (
                <div style={{ textAlign: "center" }}>
                  <p>
                    <strong>Valor unitario en USD:</strong>{" "}
                    {formatValor(valorUSD)}
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <button onClick={() => handleSave(moneda)}>Guardar</button>
                <button
                  onClick={() => handleDelete(moneda.nombre)}
                  style={{ backgroundColor: "crimson", color: "white" }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ManageCurrencies;
