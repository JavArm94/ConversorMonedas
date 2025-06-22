import { Container, Select, Input } from "./CurrencySelect.styles";

const CurrencySelect = ({
  currencies,
  selected,
  onCurrencyChange,
  amount,
  onAmountChange,
  show = true,
}) => {
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);

    // Solo permitimos valores mayores o iguales a 0
    if (!isNaN(value) && value >= 0) {
      onAmountChange(value);
    } else if (e.target.value === "") {
      // Permitimos campo vacío si se borra todo
      onAmountChange("");
    }
  };

  return (
    <Container className="currency">
      {show ? (
        <Input
          type="number"
          value={amount}
          onChange={handleAmountChange}
          min="0" // evita que usen flechitas hacia abajo
          style={{ marginRight: "10px" }}
        />
      ) : null}

      <Select value={selected} onChange={(e) => onCurrencyChange(e.target.value)}>
        {currencies?.length > 0 ? (
          currencies.map((currency) => (
            <option key={currency.nombre} value={currency.nombre}>
              {currency.descripcion}
            </option>
          ))
        ) : (
          <option value="">No currencies available</option>
        )}
      </Select>
    </Container>
  );
};

export default CurrencySelect;

