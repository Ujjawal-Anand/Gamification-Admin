import { configureStore } from '@reduxjs/toolkit';
import challengeReducer from './challengeSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

// Create a noop storage for server-side
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use web storage in browser, noop storage in server
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local')
  : createNoopStorage();

const persistConfig = {
  key: 'challenge-wizard',
  storage,
  whitelist: ['challenges', 'currentChallenge'], // persist challenges collection and current challenge
};

const persistedReducer = persistReducer(persistConfig, challengeReducer);

export const store = configureStore({
  reducer: {
    challenge: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 