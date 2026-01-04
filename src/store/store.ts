import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { provider } from './reducer';

// Set up the persist configuration
const persistConfig = {
  key: 'root', // Key in localStorage or sessionStorage
  storage, // Defaults to localStorage for web
};

// Combine your reducers
const rootReducer = combineReducers({ provider });

// Create a persisted reducer using redux-persist
const persistedReducer = persistReducer(persistConfig, rootReducer as any);

// Middleware setup
const middleware = [thunk];

// Create the store with persisted reducer and middleware
const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));

// Set up the persistor, which will handle persistence
const persistor = persistStore(store);

// Optional: Expose the store on the window object for debugging
declare global {
  interface Window {
    store: typeof store;
  }
}
window.store = store;

export { store, persistor };
