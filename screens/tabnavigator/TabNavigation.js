import { View, Text, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Finca from './Finca';
import Vaca from './Animales/Vacas';
import Produccion from './Produccion';
import Alerta from './Alerta';

const Botonsito = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Botonsito.Navigator>
      <Botonsito.Screen 
        name='Finca' 
        component={Finca} 
        options={{
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../Imagenes/finca.png')}
              style={{ width: 30, height: 30,tintColor: focused ? 'red' : 'black' }}
            />
          ),
        }}
      />

      <Botonsito.Screen style={{}}
        name='Animales' 
        component={Vaca} 
        options={{
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../Imagenes/vaca.png')}
              style={{ width: 30, height: 30,tintColor: focused ? 'red' : 'black'  }}
            />
          ),
        }}
      />

      <Botonsito.Screen 
        name='Produccion' 
        component={Produccion} 
        options={{
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../Imagenes/produccion.png')}
              style={{ width: 30, height: 30,tintColor: focused ? 'red' : 'black'  }}
            />
          ),
        }}
      />

      <Botonsito.Screen 
        name='Alerta' 
        component={Alerta} 
        options={{
          headerShown: false, 
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../Imagenes/alerta.png')}
              style={{ width: 30, height: 30,tintColor: focused ? 'red' : 'black'  }}
            />
          ),
        }}
      />
    </Botonsito.Navigator>
  );
};

export default TabNavigation





/**
 * options={{headerShown: false, 
            tabBarIcon:(tabInfo)=>{
                return (
                    <Image 
                    source={require('../screens/icon.png')} 
                    style={{width:20,height:20}}
                    />
            );
        },
        }}/>
 */