export const loadCustomCurrencies = () => {
  const monedas = [];

  for (let key in localStorage) {
    if (key.startsWith("moneda_")) {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data?.Moneda && data?.ConvertidoA?.valor > 0) {
          monedas.push({
            nombre: data.Moneda,
            descripcion: "Moneda personalizada",
            valor: data.ConvertidoA.valor,
            custom: true,
          });
        }
      } catch (e) {
        console.warn("Error al leer moneda personalizada:", e);
      }
    }
  }

  return monedas;
};
