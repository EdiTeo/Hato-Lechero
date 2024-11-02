
import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Control from './tabnavigator/Control';
import Barra from './tabnavigator/Barra';
import FormularioAddVaca from './tabnavigator/Animales/FormularioAddVaca'; 
import Vacas from './tabnavigator/Animales/Vacas'; 
 
//=====================================================
//AÑADIR A ESTA SECCION LAS VENTANAS O REDIRECCIONAMIENTOS QUE SE QUIERE MOSTRAR AL HACER CLIC 
//=====================================================
const Stack = createStackNavigator();

const Inicio = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name="Control" 
        component={Control} 
        options={{ headerShown: false }} />
        <Stack.Screen 
        name="Barra" 
        component={Barra} 
        options={{ headerShown: false }} />

        <Stack.Screen 
        name="Vacas" 
        component={Vacas} 
        options={{ headerShown: false }} />
       

        <Stack.Screen 
          name="FormularioAddVaca" 
          component={FormularioAddVaca}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default Inicio;
