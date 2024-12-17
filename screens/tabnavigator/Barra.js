import { View } from 'react-native';
import React from 'react';
import Animales from '../barraLateral/Animales';
import { useRoute } from '@react-navigation/native';

const Barra = () => {
  const route = useRoute();
  const { productor_id } = route.params;

  console.log('Productor ID:', productor_id);

  return (
    <View style={{ flex: 1 }}>
      {/* Pasar productor_id a Animales */}
      <Animales productor_id={productor_id} />
    </View>
  );
};

export default Barra;
