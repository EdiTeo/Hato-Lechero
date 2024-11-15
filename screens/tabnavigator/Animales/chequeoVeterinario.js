import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const chequeoVeterinario = ({ route}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('tratamiento',route.params)}
        >
          
          <Image source={require('../../Imagenes/tratamiento.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>Tratamiento</Text>
        </TouchableOpacity>

        
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('vacuna',route.params)}
          
        >
          <Image source={require('../../Imagenes/vacuna.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>Vacuna</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('vacaFallecimiento')}
        >
          <Image source={require('../../Imagenes/vacafallecida.jpg')} style={styles.icon} />
          <Text style={styles.cardText}>Vaca Fallecida</Text>

        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  card: {
    width: 140,
    height: 140,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sellButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  sellButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
});
export default chequeoVeterinario;