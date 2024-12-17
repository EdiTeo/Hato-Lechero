import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native'; // Importar useFocusEffect
import { useRoute } from '@react-navigation/native';
const Vacas = ({ navigation, route }) => {
  const route1 = useRoute();
      const { productor_id } = route1.params;
  const [vacas, setVacas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(true);
  

  // useFocusEffect para obtener los datos cuando la pantalla esté enfocada
  useFocusEffect(
    React.useCallback(() => {
      async function getConteoEtapas() {
        try {
          const response = await axios.get(`http://192.168.1.71:8081/api/vacas/${productor_id}`);
          
          
          // Verificar si response.data existe y tiene vacas
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            console.log(response.data); // Verifica la respuesta de la API
            setVacas(response.data);
            
          } else {
            console.log('No hay vacas registradas.');
            setVacas([]); // Establecer vacas como un arreglo vacío
          }
        } catch (error) {
          console.log('Error al obtener las vacas:', error);
          setVacas([]); // Establecer vacas como vacío si hay un error
        } finally {
          setLoading(false);
        }
      }

      getConteoEtapas();
    }, []) // La función solo se ejecutará cuando la pantalla se enfoque
  );

  // Mostrar modal cuando se agrega una vaca
  useEffect(() => {
    if (route.params?.showModal) {
      setAlertMessage('¡Vaca agregada exitosamente!');
      setModalVisible(true);
      navigation.setParams({ showModal: false });
    }
  }, [route.params]);

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const agregarVaca = (nuevaVaca) => {
    setVacas([...vacas, nuevaVaca]);
  };

  const onSeleccionarVaca = (vaca) => {
    navigation.navigate('DetallesVaca', { vaca });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Vacas</Text>

      <Button
        title="Ir a agregar nueva vaca"
        color="blue"
        onPress={() => navigation.navigate('FormularioAddVaca', { onAgregarVaca: agregarVaca,productor_id })}
      />

      {/* FlatList con validación para keyExtractor */}
      <FlatList
        data={vacas}
        keyExtractor={(item, index) => {
          // Verificar si el campo id o vaca_id está presente
          return item.id ? item.id.toString() : item.vaca_id ? item.vaca_id.toString() : index.toString();
        }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSeleccionarVaca(item)}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>{item.nombre.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.vacaName}>{item.nombre}</Text>
              <Text style={styles.vacaId}>ID: {item.vaca_id}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && vacas.length === 0 ? ( // Mostrar mensaje solo cuando no haya vacas y no esté cargando
            <View style={styles.emptyContainer}>
              <Text>No hay vacas registradas.</Text>
            </View>
          ) : null
        }
      />

      {/* Modal de alerta */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={cerrarModal}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 3 },
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8E44AD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  infoContainer: { flex: 1 },
  vacaName: { fontSize: 18, fontWeight: 'bold' },
  vacaId: { fontSize: 14, color: 'gray' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 18, marginBottom: 15, textAlign: 'center' },
  modalButton: { backgroundColor: '#009951', padding: 10, borderRadius: 5 },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
});

export default Vacas;
