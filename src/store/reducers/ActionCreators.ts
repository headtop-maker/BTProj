import {createAsyncThunk} from '@reduxjs/toolkit';
import {stagesRunFactory} from '../../connectFactory/factory';
import RNMethods from '../../Methods/RNMethods';
import {AppDispatch, RootState} from '../store';
import {deviceSlice} from './DeviceSlice';

const connectEnums = {
  connect: 'connect',
};

export const getDevices = () => (dispatch: AppDispatch) => {
  try {
    dispatch(deviceSlice.actions.deviceFetching());
    RNMethods.getDevice(data =>
      dispatch(deviceSlice.actions.deviceFetchingSuccess(data)),
    );
  } catch (e) {
    dispatch(deviceSlice.actions.deviceFetchingError(e.message));
  }
};

export const startFactory =
  () => (dispatch: AppDispatch, getState: () => RootState) => {
    const factory = new stagesRunFactory(
      {
        firstStage: () => dispatch(getDevices()),
        secondStage: () => getState().deviceReducer.devices,
        thirdStage: () =>
          dispatch(
            connectAsyncBTdevice({
              name: 'ESP32test',
              value: '24:D7:EB:10:04:1E',
            }),
          ),
        fourthStage: () => getState().deviceReducer.connected,
      },
      dispatch,
    );
    factory.run();
  };

export const connectAsyncBTdevice = createAsyncThunk(
  'device/connectDevice',
  async (item: {name: string; value: string}) => {
    const result = await RNMethods.connectDevice(item.value);
    return result === connectEnums.connect
      ? {device: item.name, connect: true}
      : {device: '', connect: false};
  },
);

// export const connectBTdevice =
//   (item: {name: string; value: string}) => async (dispatch: AppDispatch) => {
//     try {
//       const result = await RNMethods.connectDevice(item.value);
//       RNMethods.showToast(result, 1000);
//     } catch (e) {
//       RNMethods.showToast(e, 1000);
//     }
//   };
