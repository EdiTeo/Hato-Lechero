import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const Vacas = ({ navigation, route }) => {
  const [vacas, setVacas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (route.params?.showModal) {
      setAlertMessage('¡Vaca agregada exitosamente!');
      setModalVisible(true);
      navigation.setParams({ showModal: false });
    }
  }, [route.params]);

  const cerrarModal = () => {
    setModalVisible(false);
    setVacas([...vacas]);
  };
  const agregarVaca = (nuevaVaca) => {
    setVacas([...vacas, nuevaVaca]);
  };

  const onEliminarVaca = (id) => {
    setVacas(vacas.filter(vaca => vaca.id !== id));
  };

  const onEditarVaca = (vaca) => {
    navigation.navigate('FormularioAddVaca', { 
      vacaEditar: vaca, 
      onGuardar: (vacaEditada) => {
        setVacas((prevVacas) =>
          prevVacas.map((v) => (v.id === vacaEditada.id ? vacaEditada : v))
        );
        setAlertMessage('¡Vaca actualizada exitosamente!');
        setModalVisible(true);
      } 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Vacas</Text>

      <Button
        title="Ir a agregar nueva vaca"
        color="blue"
        onPress={() => navigation.navigate('FormularioAddVaca', { onAgregarVaca: agregarVaca })}
      />

      <FlatList
        data={vacas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.vacaText}>Código: {item.id}</Text>
            <Text style={styles.vacaText}>Nombre: {item.nombre}</Text>
            <Text style={styles.vacaText}>Etapa: {item.etapaCrecimiento}</Text>
            <Text style={styles.vacaText}>Estado Reproductivo: {item.estadoReproductivo}</Text>
            <Text style={styles.vacaText}>Raza: {item.raza}</Text>
            <Text style={styles.vacaText}>Fecha Nacimiento: {item.fechaNacimiento}</Text>
            <Text style={styles.vacaText}>Estado: {item.estado}</Text>
            <Button title="Editar" color="orange" onPress={() => onEditarVaca(item)} />
            <Button title="Eliminar" color="red" onPress={() => onEliminarVaca(item.id)} />
          </View>
        )}
      />

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
    backgroundColor: '#fff', padding: 15, marginVertical: 10, borderRadius: 8, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 1, height: 3 },
  },
  vacaText: { fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 300, padding: 20, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 18, marginBottom: 15, textAlign: 'center' },
  modalButton: { backgroundColor: '#009951', padding: 10, borderRadius: 5 },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
});

export default Vacas;
