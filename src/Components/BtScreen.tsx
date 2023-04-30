import React from 'react';

import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import useDimensions from '../hooks/useDimensions';
import RNMethods from '../Methods/RNMethods';

import {firebaseApi} from '../services/DeviceService';

import {
  connectAsyncBTdevice,
  startFactory,
} from '../store/reducers/ActionCreators';
import {useAppDispatch, useAppSelector} from '../store/storeHooks/redux';

import ImageScreen from './ImageScreen';

const BtScreen = () => {
  const dispatch = useAppDispatch();
  const device = useAppSelector(state => state.deviceReducer.devices);
  const stage = useAppSelector(state => state.deviceReducer.curruntStages);
  const [, , isLandScape] = useDimensions();
  const {data} = firebaseApi.useFetchAllsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [patchDev, {}] = firebaseApi.usePatchDevMutation();
  const date = new Date();

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isLandScape ? 'row' : 'column',
        },
      ]}>
      <View style={styles.images}>
        <ImageScreen />
      </View>
      <View style={styles.devices}>
        <Text style={styles.bigRed}>{data && data.dev_connect}</Text>
        <Text style={styles.bigGray}>{stage && stage}</Text>

        <ScrollView>
          {device ? (
            device.map((item, index) => (
              <TouchableOpacity
                key={'Opa' + index}
                onPress={() => dispatch(connectAsyncBTdevice(item))}>
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
          title="Start Factory"
          onPress={() => dispatch(startFactory())}
        />
        <Button
          title="Close connection"
          onPress={() => {
            patchDev({dev_connect: 'Отключено в ' + date.toString()}).unwrap;
            RNMethods.closeConnection();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bigGray: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 15,
    margin: 5,
  },
  bigRed: {
    color: '#d35f6d',
    fontWeight: 'bold',
    fontSize: 15,
    margin: 5,
  },
  images: {
    flex: 0.5,
  },
  devices: {
    flex: 0.5,
  },
});

export default BtScreen;

// const factory = new stagesRunFactory({
//   firstStage: () => dispatch(getDevices()),
//   secondStage: () => {
//     dispatch(
//       connectAsyncBTdevice({name: 'ESP32test', value: '24:D7:EB:10:04:1E'}),
//     );
//   },
//   thirdStage: () => {
//     patchDev({dev_6: Math.floor(Math.random() * 100000) + 1}).unwrap;
//     console.log(data);
//   },
// });
// factory.run();

// const [putDev] = firebaseApi.usePutDevMutation();
// const [postDev] = firebaseApi.usePostDevMutation();

// {
/* <Button title="get device" onPress={() => dispatch(getDevices())} />
<Button
  title="send message A"
  onPress={() => RNMethods.sendMessage('A')}
/>
<Button
  title="send message B"
  onPress={() => RNMethods.sendMessage('B')}
/>
<Button title="clear" onPress={() => RNMethods.clearCache()} />
<Button title="put " onPress={() => putDev(833).unwrap} />
<Button title="post " onPress={() => postDev({dev_3: 789}).unwrap} /> */
// }
