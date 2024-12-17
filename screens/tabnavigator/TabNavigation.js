import { View, Text, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Finca from './Finca';
import Vaca from './Animales/Vacas';
import Produccion from './Produccion';
import Alerta from './Alerta';

const Botonsito = createBottomTabNavigator();

const TabNavigation = ({ productor_id }) => {
  return (
    <Botonsito.Navigator>
      <Botonsito.Screen
        name='Finca'
        component={Finca}
        initialParams={{ productor_id }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={{uri: 'https://res.cloudinary.com/deqnrwzno/image/upload/v1734441236/finca_a0exo2.png'}}
              style={{ width: 30, height: 30, tintColor: focused ? 'red' : 'black' }}
            />
            
          ),
        }}
      />

      <Botonsito.Screen
        name='Animales'
        component={Vaca}
        initialParams={{ productor_id }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
            source={{uri: 'https://res.cloudinary.com/deqnrwzno/image/upload/v1734441238/vaca_nsfxo7.png'}}
              style={{ width: 30, height: 30, tintColor: focused ? 'red' : 'black' }}
            />
          ),
        }}
      />

      <Botonsito.Screen
        name='Produccion'
        component={Produccion}
        initialParams={{ productor_id }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
            source={{uri: 'https://res.cloudinary.com/deqnrwzno/image/upload/v1734441236/produccion_nymltd.png'}}
              style={{ width: 30, height: 30, tintColor: focused ? 'red' : 'black' }}
            />
          ),
          
        }}
      />

      <Botonsito.Screen
        name='Alerta'
        component={Alerta}
        initialParams={{ productor_id }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
            source={{uri: 'https://res.cloudinary.com/deqnrwzno/image/upload/v1734441236/alerta_metlvi.png'}}
              style={{ width: 30, height: 30, tintColor: focused ? 'red' : 'black' }}
            />
          ),
        }}
      />
    </Botonsito.Navigator>
  );
};

export default TabNavigation;
