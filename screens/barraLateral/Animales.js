//import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Produccion from './Produccion'
//import Caja from './Caja'
import LaFinca from './LaFinca';
import Evento from './Evento';
import Registro from './Registro';
  
const Drawer=createDrawerNavigator()
//drawer para navegar 
//este tiene que ser true
const Animales = ({ productor_id }) => {
  
  return (
     <Drawer.Navigator drawerContent={props => <Registro {...props} />}>
      <Drawer.Screen name="Produccion" component={Produccion} options={{ headerShown: true }} initialParams={{ productor_id }}/>
      <Drawer.Screen name="LaFinca" component={LaFinca} options={{ headerShown: true }} />
      <Drawer.Screen name="Evento" component={Evento} options={{ headerShown: true }} />
    </Drawer.Navigator>
       
  )
}

export default Animales