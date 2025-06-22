import currencyList from "../assets/CurrencyTranslate.json";

const getCustomCurrencies = () => {
  const custom = [];

  for (let key in localStorage) {
    if (key.startsWith("moneda_")) {
      try {
        const item = JSON.parse(localStorage.getItem(key));

        if (
          item?.Moneda &&
          item?.ConvertidoA?.valor &&
          !isNaN(item.ConvertidoA.valor)
        ) {
          custom.push({
            nombre: item.Moneda.toUpperCase(),
            descripcion: item.Moneda,
            valor: item.ConvertidoA.valor,
            personalizada: true,
          });
        }
      } catch (err) {
        console.warn("Error leyendo moneda personalizada", err);
      }
    }
  }

  return custom.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
};

export const loadAllCurrencies = () => {
  const oficiales = [...currencyList].sort((a, b) =>
    a.descripcion.localeCompare(b.descripcion)
  );

  const personalizadas = getCustomCurrencies();

  return [...oficiales, ...personalizadas];
};

export const convertirDesdePersonalizada = async (
  monedaUsuario,
  cantidad,
  destino,
  fetchConversionFn
) => {
  if (!monedaUsuario?.valor || isNaN(monedaUsuario.valor)) {
    throw new Error("Moneda de usuario inválida");
  }

  const enDolares = cantidad * monedaUsuario.valor;

  const tasaDestino = await fetchConversionFn("USD", destino);

  return enDolares * tasaDestino;
};
