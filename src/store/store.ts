import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {deviceApi, firebaseApi} from '../services/DeviceService';
import deviceReducer from './reducers/DeviceSlice';

const rootReducer = combineReducers({
  deviceReducer,
  [deviceApi.reducerPath]: deviceApi.reducer,
  [firebaseApi.reducerPath]: firebaseApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(
        deviceApi.middleware,
        firebaseApi.middleware,
      ),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
