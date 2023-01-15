import React, {useEffect, useState} from 'react';
import {View, DeviceEventEmitter} from 'react-native';
import FastImage from 'react-native-fast-image';
import useDimensions from '../hooks/useDimensions';

const ImageScreen = () => {
  const [eventData, setEventData] = useState<string>();
  const [secondFrame, setSecondFrame] = useState<string>();
  const [screenWidth, screenHeigth, isLandScape] = useDimensions();
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'base64',
      (data: {message: string} | undefined) => {
        if (data && data.message !== undefined) {
          setEventData(data.message);
        }
      },
    );
    const subscription2 = DeviceEventEmitter.addListener(
      'status',
      (data: {message: string} | undefined) => {
        if (data && data.message !== undefined) {
          if (data.message === 'refresh') {
            setSecondFrame(eventData);
          }
        }
      },
    );
    return () => {
      subscription.remove();
      subscription2.remove();
    };
  }, [eventData]);
  return (
    <View style={{backgroundColor: '#292a2d'}}>
      <FastImage
        style={{
          width: isLandScape ? screenWidth * 0.45 : screenWidth,
          height: isLandScape ? screenHeigth : screenHeigth * 0.45,
          alignSelf: 'center',
          position: 'relative',
        }}
        source={{
          uri: `data:image/jpeg;base64,${secondFrame}`,
        }}
      />
      <FastImage
        style={{
          width: isLandScape ? screenWidth * 0.45 : screenWidth,
          height: isLandScape ? screenHeigth : screenHeigth * 0.45,
          alignSelf: 'center',
          position: 'absolute',
        }}
        source={{
          uri: `data:image/jpeg;base64,${eventData}`,
        }}
      />
    </View>
  );
};

export default ImageScreen;
