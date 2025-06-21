import { CurrencyProvider } from "./context/CurrencyContext";
import CurrencyExchange from "./containers/CurrencyExchange"; // Importa el contenedor
import GlobalStyles from "./styles/GlobalStyles";
import "./App.css";
import TaxSelect from "./components/TaxSelect";
import CreateCurrency from "./components/CreateCurrency";

function App() {
  return (
    <>
      <GlobalStyles />
      <CurrencyProvider>
        <CurrencyExchange />
        <TaxSelect></TaxSelect>
        <CreateCurrency></CreateCurrency>
      </CurrencyProvider>
    </>
  );
}

export default App;
