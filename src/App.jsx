import { CurrencyProvider } from "./context/CurrencyContext";
import CurrencyExchange from "./containers/CurrencyExchange"; // Importa el contenedor
import "./App.css";

function App() {
  return (
    <CurrencyProvider>
      <CurrencyExchange />
    </CurrencyProvider>
  );
}

export default App;
