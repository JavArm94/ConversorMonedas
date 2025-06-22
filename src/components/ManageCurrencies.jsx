const ManageCurrencies = () => {
  const monedas = Object.keys(localStorage)
    .filter((k) => k.startsWith("moneda_"))
    .map((key) => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const handleDelete = (nombre) => {
    localStorage.removeItem(`moneda_${nombre.toLowerCase()}`);
    window.location.reload(); // O podés usar estado
  };

  return (
    <div>
      <h3>Monedas personalizadas</h3>
      {monedas.map((m) => (
        <div key={m.Moneda} style={{ marginBottom: "0.5rem" }}>
          <strong>{m.Moneda}</strong> (base: {m.ConvertidoA.nombre}, cantidad:{" "}
          {m.Cantidad})
          <button onClick={() => handleDelete(m.Moneda)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

export default ManageCurrencies;
