import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Embarazo = (route) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  
  const [inseminacionData, setInseminacionData] = useState({
    fecha: new Date().toISOString().split('T')[0], // Fecha de hoy
    razaPadre: '',
    modalidad: '',
    nota: '',
  });
  const [partoData, setPartoData] = useState({
    nombre: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: '',
    nota: '',
  });
  const [abortoData, setAbortoData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    genero: '',
    nota: '',
  });

  const [puedeInseminar, setPuedeInseminar] = useState(true);
const[idinseminacion,setInseminacion]=useState(null);
  // Verificar inseminaciones pendientes al cargar el componente
  useEffect(() => {
    const verificarInseminacion = async () => {
        try {
            const response = await fetch(`http://192.168.1.71:19000/api/vaca/${route.route.params.vaca.vaca_id}/inseminacion-pendiente`);
            const data = await response.json();
            setInseminacion(data.reproduccion_id);

            // Verifica si el mensaje indica que hay una inseminación pendiente
            if (data.mensaje.includes("No hay inseminación pendiente")) {
                setPuedeInseminar(true); // Puede inseminar porque no hay inseminación pendiente
            } else {
                setPuedeInseminar(false); // No puede inseminar porque ya tiene una inseminación pendiente
                Alert.alert('Aviso', data.mensaje); // Muestra el mensaje de la API
            }
        } catch (error) {
            console.error('Error verificando inseminación pendiente:', error);
        }
    };

    verificarInseminacion();
}, []);

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };
  const saveInseminacion = async () => {
    try {
      const response = await axios.post('http://192.168.1.71:19000/api/reproducciones', {
        vaca_id: route.route.params.vaca.vaca_id, // ID de la vaca
        fecha_inseminacion: inseminacionData.fecha,
        raza_toro: inseminacionData.razaPadre,
        
      });

      Alert.alert('Éxito', 'Datos de inseminación guardados correctamente.');
      navigation.goBack();
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al guardar la inseminación:', error);
      Alert.alert('Error', 'No se pudo guardar la inseminación.');
    }
  };
  const actualizarParto = async () => {
    try {
        const response = await axios.put(`http://192.168.1.71:19000/api/reproducciones/${idinseminacion}`, {
            fecha_real_parto: partoData.fecha,
            estado_parto: partoData.estado,
        });
        console.log(response.data.mensaje);
    } catch (error) {
        console.error("Error al actualizar el parto", error);
    }
};
const actualizarAborto = async () => {
  try {
      const response = await axios.put(`http://192.168.1.71:19000/api/reproducciones/${idinseminacion}`, {
          fecha_real_parto: abortoData.fecha,
          estado_parto: partoData.estado,
      });
      console.log(response.data.mensaje);
  } catch (error) {
      console.error("Error al actualizar el parto", error);
  }
};
  const handleSave = () => {
    switch (modalType) {
      case 'Inseminación':
        saveInseminacion();
        break;
      case 'Parto':
        actualizarParto();
        break;
      case 'Aborto':
        Alert.alert('Datos Aborto', JSON.stringify(abortoData, null, 2));
        break;
      default:
        break;
    }
    closeModal();
  };

  return (
    <View style={styles.container}>
      {/* Botones principales */}
      <View style={styles.cardContainer}>
  <TouchableOpacity
    style={[styles.card, !puedeInseminar && { opacity: 0.5 }]}
    onPress={() => puedeInseminar && openModal('Inseminación')}
    disabled={!puedeInseminar}
  >
    <Image
      source={require('../../Imagenes/datosGenerales.png')}
      style={styles.icon}
    />
    <Text style={styles.cardText}>Inseminación</Text>
  </TouchableOpacity>
  </View>
  <View style={styles.cardContainer}>
  <TouchableOpacity
    style={styles.card}
    onPress={() => openModal('Parto')}
  >
    <Image
      source={require('../../Imagenes/tratamiento.jpg')}
      style={styles.icon}
    />
    <Text style={styles.cardText}>Actualizar estado</Text>
  </TouchableOpacity>

  
</View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalType}</Text>
            {modalType === 'Inseminación' && (
              <>
                <Text>Fecha:</Text>
                <TextInput
                  style={styles.input}
                  value={inseminacionData.fecha}
                  onChangeText={(text) => setInseminacionData({ ...inseminacionData, fecha: text })}
                />
                <Text>Raza del Padre:</Text>
                <TextInput
                  style={styles.input}
                  value={inseminacionData.razaPadre}
                  onChangeText={(text) => setInseminacionData({ ...inseminacionData, razaPadre: text })}
                />
                <Text>Modalidad:</Text>
                <TextInput
                  style={styles.input}
                  value={inseminacionData.modalidad}
                  onChangeText={(text) => setInseminacionData({ ...inseminacionData, modalidad: text })}
                />
                <Text>Nota:</Text>
                <TextInput
                  style={styles.input}
                  value={inseminacionData.nota}
                  onChangeText={(text) => setInseminacionData({ ...inseminacionData, nota: text })}
                />
              </>
            )}
            {modalType === 'Parto' && (
              <>
                
                <Text>Fecha:</Text>
                <TextInput
                  style={styles.input}
                  value={partoData.fecha}
                  onChangeText={(text) => setPartoData({ ...partoData, fecha: text })}
                />
                <Text>Estado del Parto:</Text>
                <TextInput
                  style={styles.input}
                  value={partoData.estado}
                  onChangeText={(text) => setPartoData({ ...partoData, estado: text })}
                />
                <Text>Nota:</Text>
                <TextInput
                  style={styles.input}
                  value={partoData.nota}
                  onChangeText={(text) => setPartoData({ ...partoData, nota: text })}
                />
              </>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Guardar</Text>
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
    flexDirection: 'row', // Mantener en fila
  flexWrap: 'wrap',    // Permitir salto a nueva fila
  justifyContent: 'center', // Centrar elementos horizontalmente
  alignItems: 'center', // Centrar elementos verticalmente
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    width: '100%',
    padding: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
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
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Embarazo;
