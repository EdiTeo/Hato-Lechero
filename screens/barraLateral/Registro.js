import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Registro = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../Imagenes/holaa.jpg')}
          style={styles.logo}
        />
      </View>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="home" size={24} color="black" />
        <Text style={styles.menuText}>LA FINCA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="calendar" size={24} color="black" />
        <Text style={styles.menuText}>EVENTOS Y TAREAS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Perfil')}>
        <Icon name="user" size={24} color="black" />
        <Text style={styles.menuText}>PERFIL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="cow" size={24} color="black" />
        <Text style={styles.menuText}>CONTROL GANADERO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="sign-out" size={24} color="black" />
        <Text style={styles.menuText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3', // Gris claro
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: 'black',
  },
});
export default Registro