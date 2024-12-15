import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

const formularioVacuna = ({ navigation, route }) => {
  const [medicamento, setvacuna] = useState('');
  const [notas, setNotas] = useState('');
  const [descripcion, setenfermedad] = useState('');
  const [fechaVacuna, setFechaVacuna] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (route.params?.vacaEditar) {
      const vacaEditar = route.params.vacaEditar;
      setvacuna(vacaEditar.medicamento);
      setNotas(vacaEditar.notas);
      setenfermedad(vacaEditar.descripcion || '');
      setFechaVacuna(new Date(vacaEditar.fechaVacuna));
    }
  }, [route.params?.vacaEditar]);

  const agregarVaca = async () => {
    if (validacionEntradas()) {
      const nuevaVaca = {
        descripcion,
        notas,
        medicamento,
        dias_tratamiento: 0,
        fecha_inicio: fechaVacuna.toISOString().split('T')[0],
        vaca_id: route.params.params.vaca.vaca_id || null,
        tipo: "vacunación",
    };
    

      try {
        console.log("Enviando:", nuevaVaca);
        const response = await axios.post(`http://192.168.20.3:8081/api/historial-medico`, nuevaVaca);  // Reemplaza localhost por la IP de tu máquina
        console.log("Respuesta:", response);

        if (response.status === 200 || response.status === 201) {
          if (route.params?.onAgregarVaca) {
            route.params.onAgregarVaca(nuevaVaca);
          }
          navigation.goBack();
        } else {
          setAlertMessage('Error al guardar el tratamiento.');
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setAlertMessage('Hubo un problema con la conexión a la base de datos.');
        setModalVisible(true);
      }
    }
  };

  const validacionEntradas = () => {
    const onlyLettersRegex = /^[a-zA-Z\s]+$/; // regex solo letras
    if (!medicamento || !notas || !descripcion ) {
      setAlertMessage('Por favor, complete todos los campos.');
      setModalVisible(true);
      return false;
    }
    if (!onlyLettersRegex.test(medicamento) || !onlyLettersRegex.test(notas) || !onlyLettersRegex.test(descripcion)) {
      setAlertMessage('Los campos diagnóstico, notas y descripcion deben contener solo letras.');
      setModalVisible(true);
      return false;
    }
    
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Fecha de Vacuna:</Text>
      <Button color="green" title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={fechaVacuna}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || fechaVacuna;
            setShowDatePicker(false);
            setFechaVacuna(currentDate);
          }}
        />
      )}
      <Text style={styles.dateText}>Fecha seleccionada: {fechaVacuna.toLocaleDateString()}</Text>
      
      <TextInput placeholder="medicamento" style={styles.input} value={medicamento} onChangeText={setvacuna} />
      <TextInput placeholder="descripcion" style={styles.input} value={descripcion} onChangeText={setenfermedad} />
      <TextInput placeholder="Notas" style={styles.input} value={notas} onChangeText={setNotas} />

      <View style={styles.buttonContainer}>
        <Button title="Cancelar" color="#EC221F" onPress={() => navigation.goBack()} />
        <Button title="Aceptar" color="green" onPress={agregarVaca} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  dateText: { fontSize: 16, marginVertical: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContainer: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 15, textAlign: 'center' },
  closeButton: { backgroundColor: 'green', padding: 10, borderRadius: 5 },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default formularioVacuna;
