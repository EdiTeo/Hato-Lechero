import { View, Text } from 'react-native'
import React from 'react'
import TabNavigation from '../tabnavigator/TabNavigation'
import { useRoute } from '@react-navigation/native';
const Produccion = () => {
  const route = useRoute();
  const { productor_id } = route.params;
  return (
    <View style={{flex:1}}>
    <TabNavigation productor_id={productor_id}/>
    </View>
  )
}

export default Produccion;