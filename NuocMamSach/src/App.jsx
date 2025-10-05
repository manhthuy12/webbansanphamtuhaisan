import Routers from "./Routers";
import store from "./redux/store/store";
import { Provider } from "react-redux";
function App() {
  return (
    <Provider store={store}>
      <Routers />
    </Provider>
  );
}

export default App;
