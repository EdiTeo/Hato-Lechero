import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const inforVaca = ({ route }) => {
  const navigation = useNavigation();
  const { vacaId } = route.params.vaca.vaca_id; // Supongo que el ID de la vaca viene en los parámetros de la ruta
  const [modalVisible, setModalVisible] = useState(false);
  const handleDelete = async () => {
    try {
      // Realizar solicitud DELETE a la API
      await axios.delete(`http://192.168.1.71:8081/api/vacas/${route.params.vaca.vaca_id}`);
      Alert.alert('Éxito', 'La vaca ha sido eliminada.');
      setModalVisible(false);
      navigation.goBack(); // Navegar a la pantalla anterior
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la vaca. Intenta nuevamente.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('datosGenerales', route)}
        >
          <Image
            source={require('../../Imagenes/datosGenerales.png')}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Datos generales</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('DatosVeterinarios', route)}
        >
          <Image
            source={require('../../Imagenes/tratamiento.jpg')}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Datos veterinarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate('estadoReproductivo', route.params)}>
          <Image
            source={require('../../Imagenes/vaca22.png')}
            style={styles.icon}
            
          />
          <Text style={styles.cardText}>Reproducción</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.sellButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.sellButtonText}>Eliminar o vendido</Text>
      </TouchableOpacity>

      {/* Modal de confirmación */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¿Está seguro?</Text>
            <Text style={styles.modalMessage}>
              ¿Desea eliminar esta vaca permanentemente?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#ff4d4d',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default inforVaca;
