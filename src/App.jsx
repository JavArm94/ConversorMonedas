import { CurrencyProvider } from "./context/CurrencyContext";
import CurrencyExchange from "./containers/CurrencyExchange"; // Importa el contenedor
import GlobalStyles from "./styles/GlobalStyles";
import "./App.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <CurrencyProvider>
        <CurrencyExchange />
      </CurrencyProvider>
    </>
  );
}

export default App;
