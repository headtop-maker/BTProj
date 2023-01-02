import React, {useState} from 'react';

import {
  Text,
  View,
  Button,
  NativeModules,
  TouchableOpacity,
} from 'react-native';
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
  connectDevice: (macAddress: string) => BTModule.connectDevice(macAddress),
};

const BtScreen = () => {
  const [devices, setDevices] = useState<GetDevice[] | undefined>();
  console.log('devices', devices);
  return (
    <View>
      <Text>11111</Text>
      {devices &&
        devices.map((item, index) => (
          <TouchableOpacity
            key={'Opa' + index}
            onPress={() => RNMethods.connectDevice(item.value)}>
            <Text key={'Key' + index}>
              {item.name} {item.value}
            </Text>
          </TouchableOpacity>
        ))}
      <Button
        title="kotlin toast"
        onPress={() => RNMethods.showToast('Test', 5)}
      />

      <Button
        title="get device"
        onPress={() => RNMethods.getDevice(setDevices)}
      />
    </View>
  );
};

export default BtScreen;
