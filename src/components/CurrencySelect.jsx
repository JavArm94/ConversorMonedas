import { Container, Select, Input } from "./CurrencySelect.styles";

const CurrencySelect = ({
  currencies,
  selected,
  onCurrencyChange,
  amount,
  onAmountChange,
  show = true,
}) => (
  <Container className="currency">
    {show ? (
      <Input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        style={{ marginRight: "10px" }}
      />
    ) : null}
    <Select value={selected} onChange={(e) => onCurrencyChange(e.target.value)}>
      {currencies?.length > 0 ? (
        currencies.map((currency) => (
          <option key={currency.nombre} value={currency.nombre}>
            {currency.nombre} - {currency.descripcion || "Oficial"}
          </option>
        ))
      ) : (
        <option value="">No currencies available</option>
      )}
    </Select>
  </Container>
);

export default CurrencySelect;
