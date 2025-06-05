const CurrencySelect = ({
  currencies,
  selected,
  onCurrencyChange,
  amount,
  onAmountChange,
  show = true,
}) => (
  <div className="currency">
    {show ? (
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        style={{ marginRight: "10px" }}
      />
    ) : null}
    <select value={selected} onChange={(e) => onCurrencyChange(e.target.value)}>
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
