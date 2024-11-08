import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const Control = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Barra');
    }, 2000);
  }, []);

  return (
    <View>
      <Text>Control</Text>
    </View>
  );
};

export default Control;
