import React from 'react';
import {View, Text} from 'react-native';
import {deviceApi} from '../services/DeviceService';

const FireBaseImageScreen = () => {
  const {data: posts} = deviceApi.useFetchAllsQuery(5);
  return (
    <View>
      {posts &&
        posts.map((post, index) => (
          <View key={'post' + index}>
            <Text style={{color: 'red'}}>{post.title}</Text>
            <Text>{post.body}</Text>
          </View>
        ))}
    </View>
  );
};

export default FireBaseImageScreen;
