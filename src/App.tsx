import React, {useEffect} from 'react';
import BtScreen from './Components/BtScreen';
import {Provider as ReduxProvider} from 'react-redux';
import {setupStore} from './store/store';
import {PermissionsAndroid} from 'react-native';

const store = setupStore();

const App = () => {
  const requestBlueToothPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: 'App Bluetooth Permission',
          message: 'App needs access to your Bluetooth ',

          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Bluetooth');
      } else {
        console.log('Bluetooth permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestBlueToothPermission();
  }, []);
  return (
    <ReduxProvider store={store} key={'provider'}>
      <BtScreen />
    </ReduxProvider>
  );
};

export default App;
