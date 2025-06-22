import { CurrencyProvider } from "./context/CurrencyContext";
import CurrencyExchange from "./containers/CurrencyExchange";
import TaxSelect from "./components/TaxSelect";
import CreateCurrency from "./components/CreateCurrency";
import GlobalStyles from "./styles/GlobalStyles";
import "./App.css";

function App() {
  return (
    <>
      <GlobalStyles />
      <CurrencyProvider>
        <div className="app-container">
          <h1 className="title">DiviEx</h1>

          {/* {/*<div className="main-section"> */}
            <div className="card exchange-card">
              <CurrencyExchange />
            </div>

            <div className="card tax-card">
              <TaxSelect />
            </div>
          {/* {/*</div> */}

          <div className="card create-card">
            <CreateCurrency />
          </div>
        </div>
      </CurrencyProvider>
    </>
  );
}

export default App;
