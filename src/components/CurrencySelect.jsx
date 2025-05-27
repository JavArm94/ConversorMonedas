const CurrencySelect = ({ currencies }) => (
  <div className="currency">
    <select>
      {currencies?.length > 0 ? (
        currencies.map((currency) => (
          <option key={currency.nombre} value={currency.nombre}>
            {currency.descripcion}
          </option>
        ))
      ) : (
        <option value="">No currencies available</option>
      )}
    </select>
  </div>
);

export default CurrencySelect;
