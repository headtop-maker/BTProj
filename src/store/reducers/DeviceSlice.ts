import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import RNMethods from '../../Methods/RNMethods';
import {connectAsyncBTdevice} from './ActionCreators';

interface IDevice {
  name: string;
  value: string;
}

export interface IConnected {
  device: string;
  connect: boolean;
}

interface IDeviceState {
  devices: IDevice[];
  isLoading: boolean;
  error: string;
  connected: IConnected;
  curruntStages: string;
}

const initialState: IDeviceState = {
  devices: [],
  isLoading: false,
  error: '',
  connected: {device: '', connect: false},
  curruntStages: '',
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    deviceFetching(state) {
      state.isLoading = true;
    },
    deviceFetchingSuccess(state, action: PayloadAction<IDevice[]>) {
      state.isLoading = false;
      state.error = '';
      state.devices = action.payload;
    },
    deviceFetchingError(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    deviceStages(state, action: PayloadAction<string>) {
      state.curruntStages = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(connectAsyncBTdevice.pending, state => {
      state.isLoading = true;
      state.error = '';
      state.connected = {device: '', connect: false};
    });
    builder.addCase(
      connectAsyncBTdevice.fulfilled,
      (state, action: PayloadAction<IConnected>) => {
        state.isLoading = false;
        state.error = '';
        state.connected = action.payload;
        RNMethods.showToast(`подключено к ${action.payload.device}`, 1000);
      },
    );
    builder.addCase(connectAsyncBTdevice.rejected, state => {
      state.isLoading = false;
      state.error = 'ошибка подключения';
      state.connected = {device: '', connect: false};
      RNMethods.showToast('ошибка подключения', 1000);
    });
  },
});

export default deviceSlice.reducer;
