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
    const actualizadas = [...monedasPersonalizadas];
    actualizadas[index].cantidad = parseFloat(value);
    setMonedasPersonalizadas(actualizadas);
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

  // const handleDelete = (nombre) => {
  //   localStorage.removeItem(`moneda_${nombre.toLowerCase()}`);
  //   setMonedasPersonalizadas((prev) => prev.filter((m) => m.nombre !== nombre));
  //   dispatch({ type: "FORCE_RELOAD_CURRENCIES" });
  //   dispatch({ type: "FORCE_RECONVERT" });
  // };

  const handleDelete = (nombre) => {
    localStorage.removeItem(`moneda_${nombre.toLowerCase()}`);
    const actualizadas = monedasPersonalizadas.filter(
      (m) => m.nombre !== nombre
    );
    setMonedasPersonalizadas(actualizadas);

    // Dispara el refresco del estado global
    dispatch({ type: "FORCE_RELOAD_CURRENCIES" });

    // También forzamos una reconversión con valores válidos por si se borró una moneda usada actualmente
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
      {isSaving && <p style={{ color: "green" }}>Guardando moneda...</p>}

      {monedasPersonalizadas.length === 0 ? (
        <p>No hay monedas personalizadas.</p>
      ) : (
        monedasPersonalizadas.map((moneda, index) => {
          const cantidad = moneda.cantidad;
          const valorUSD = 1 / cantidad;

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
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
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

              <div>
                <p>
                  <strong>Valor unitario en USD:</strong>{" "}
                  {formatValor(valorUSD)}
                </p>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
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
