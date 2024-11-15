
import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DatosVeterinarios from './tabnavigator/Animales/datosVeterinarios';
import chequeoVeterinario from './tabnavigator/Animales/chequeoVeterinario';
import Control from './tabnavigator/Control';
import Barra from './tabnavigator/Barra';
import FormularioAddVaca from './tabnavigator/Animales/FormularioAddVaca'; 
import Vacas from './tabnavigator/Animales/Vacas'; 
import formularioFallecimiento from './tabnavigator/Animales/formularioFallecimiento';
import formularioTratamiento from './tabnavigator/Animales/formularioTratamiento';
import formularioVacuna from './tabnavigator/Animales/formularioVacuna';
import infoVaca from './tabnavigator/Animales/infoVaca';
import datosGenerales from './tabnavigator/Animales/datosGenerales';
import EstadoReproductivo from './tabnavigator/Animales/estadoReproductivo';
 
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
        <Stack.Screen 
        name="DatosVeterinarios" 
        component={DatosVeterinarios} />
        <Stack.Screen 
        name="chequeoVeterinario" 
        component={chequeoVeterinario} />

        <Stack.Screen 
        name="vacaFallecimiento" 
        component={formularioFallecimiento} />

<Stack.Screen 
        name="tratamiento" 
        component={formularioTratamiento} />
        <Stack.Screen 
        name="vacuna" 
        component={formularioVacuna} />
        <Stack.Screen 
        name="DetallesVaca" 
        component={infoVaca} />
        <Stack.Screen 
        name="datosGenerales" 
        component={datosGenerales} />
        <Stack.Screen 
        name="estadoReproductivo" 
        component={EstadoReproductivo} />
      </Stack.Navigator>
      
      
    </NavigationContainer>
  );
};

export default Inicio;
