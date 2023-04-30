import {NativeModules} from 'react-native';
const {ToastKotlin, BTModule} = NativeModules;

type GetDevice = {
  name: string;
  value: string;
};

const RNMethods = {
  showToast: (message: string, timeOut: number) =>
    ToastKotlin.show(message, timeOut),
  getDevice: async (callBack: (data: any) => void) =>
    await BTModule.getDevice((data: GetDevice[]) => {
      const obj = Object.entries(data).map(item => ({
        name: item[0],
        value: item[1],
      }));
      callBack(obj);
    }),
  connectDevice: (macAddress: string) => BTModule.connectDeviceFC(macAddress),
  sendMessage: (message: string) => BTModule.sendMessage(message),
  clearCache: () => BTModule.clearCache(),
  closeConnection: () => BTModule.closeConnection(),
};

export default RNMethods;
