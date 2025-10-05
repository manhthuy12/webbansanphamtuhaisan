import { createRoot } from 'react-dom/client';

// third party
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// project imports
import App from './App';
import reducer from './store/reducer';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// style + assets
import 'assets/scss/style.scss';
import reportWebVitals from 'reportWebVitals';

// convert object to string and store in localStorage
function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('persistantState', serializedState);
  } catch (e) {
    console.warn('Error saving to localStorage', e);
  }
}

// load string from localStorage and convert into an Object
// invalid output must be undefined
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem('persistantState');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Error loading from localStorage', e);
    return undefined;
  }
}

// Load persisted state
const persistedState = loadFromLocalStorage();

// Configure store with persisted state
const store = configureStore({
  reducer,
  preloadedState: persistedState
});

// Save store state to localStorage on any state change
store.subscribe(() => saveToLocalStorage(store.getState()));

// Render the application
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
