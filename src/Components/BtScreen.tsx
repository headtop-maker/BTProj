import React, {useState, useEffect} from 'react';

import {
  Text,
  View,
  Image,
  Button,
  NativeModules,
  TouchableOpacity,
  DeviceEventEmitter,
  ScrollView,
} from 'react-native';
import useDimensions from '../hooks/useDimensions';
import ImageScreen from './ImageScreen';
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
};

const BtScreen = () => {
  const [devices, setDevices] = useState<GetDevice[] | undefined>();

  const [, , isLandScape] = useDimensions();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: isLandScape ? 'row' : 'column',
      }}>
      <View style={{flex: 0.5}}>
        <ImageScreen />
      </View>
      <View style={{flex: 0.5}}>
        <ScrollView>
          {devices ? (
            devices.map((item, index) => (
              <TouchableOpacity
                key={'Opa' + index}
                onPress={() => RNMethods.connectDevice(item.value)}>
                <Text key={'Key' + index}>
                  {item.name} {item.value}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>Нет устройств</Text>
          )}
        </ScrollView>
        <Button
          title="get device"
          onPress={() => RNMethods.getDevice(setDevices)}
        />
        <Button
          title="send message A"
          onPress={() => RNMethods.sendMessage('A')}
        />
        <Button
          title="send message B"
          onPress={() => RNMethods.sendMessage('B')}
        />
      </View>
    </View>
  );
};

export default BtScreen;
