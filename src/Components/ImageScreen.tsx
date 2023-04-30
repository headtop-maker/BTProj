import React, {useEffect, useState} from 'react';
import {View, DeviceEventEmitter, Image, StyleSheet} from 'react-native';
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
    <View style={styles.container}>
      <Image
        style={[
          styles.backImage,
          {
            width: isLandScape ? screenWidth * 0.45 : screenWidth,
            height: isLandScape ? screenHeigth : screenHeigth * 0.45,
          },
        ]}
        source={{
          uri: `data:image/jpeg;base64,${secondFrame}`,
        }}
      />
      <Image
        style={[
          styles.firstImage,
          {
            width: isLandScape ? screenWidth * 0.45 : screenWidth,
            height: isLandScape ? screenHeigth : screenHeigth * 0.45,
          },
        ]}
        source={{
          uri: `data:image/jpeg;base64,${eventData}`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#292a2d',
  },
  backImage: {
    alignSelf: 'center',
    position: 'relative',
  },
  firstImage: {
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default ImageScreen;
